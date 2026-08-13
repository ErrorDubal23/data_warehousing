// ---------------------------------------------------------------------------
// Pipeline real de datos — inspirado en utils/etl.py del proyecto de referencia,
// reimplementado en JS. parseFecha/parseMonto entienden el desorden real de
// ETL_DIRTY; runETL limpia, deduplica y reporta métricas de calidad; toDirtyRow
// convierte una venta registrada en vivo (Bloque OLTP) en una fila "sucia" más,
// para que el pipeline completo (OLTP → ETL → Data Warehouse → OLAP) esté
// realmente conectado y no sean cuatro vitrinas independientes.
// ---------------------------------------------------------------------------

import { PRODUCTOS, SUCURSALES } from "../data/mockData";

// Tasa fija (no aleatoria) para que la demo sea reproducible en cada ensayo.
export const CLP_TO_USD_RATE = 900;

const SUCURSAL_ALIASES = {
  "suc. norte 01": "SUC-N1",
  "sucursal norte 1": "SUC-N1",
  "sucursal norte 2": "SUC-N2",
  "suc. sur": "SUC-S1",
  "sucursal sur 1": "SUC-S1",
  "sucursal centro 1": "SUC-C1",
  "sucursal este 1": "SUC-E1",
};

const DATE_FORMATTERS = [
  (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`, // DD/MM/AAAA
  (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, // ISO
  (d) => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()}`, // MM-DD-AAAA
  (d) => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`, // AAAA.MM.DD
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function resolveSucursal(raw) {
  const norm = normalize(raw);
  if (SUCURSAL_ALIASES[norm]) return SUCURSAL_ALIASES[norm];
  const found = SUCURSALES.find((s) => normalize(s.nombre) === norm);
  return found ? found.id : null;
}

export function resolveProducto(raw) {
  const norm = normalize(raw);
  const found = PRODUCTOS.find((p) => normalize(p.nombre) === norm);
  return found ? found.id : null;
}

// Entiende AAAA-MM-DD, DD/MM/AAAA, MM-DD-AAAA y AAAA.MM.DD — los cuatro
// formatos mezclados que llegan desde las distintas sucursales.
export function parseFecha(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return null;

  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  m = s.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (m) return `${m[3]}-${m[1]}-${m[2]}`;

  return null;
}

// Entiende "$45.990 CLP" (miles con punto) y "USD 58.30".
export function parseMonto(raw) {
  if (raw == null) return null;
  if (typeof raw === "number") return raw;
  const s = String(raw).trim();

  const usdMatch = s.match(/USD\s*([\d.,]+)/i);
  if (usdMatch) return Number(usdMatch[1].replace(",", "."));

  const clpMatch = s.match(/\$?\s*([\d.]+)\s*CLP/i);
  if (clpMatch) {
    const clp = Number(clpMatch[1].replace(/\./g, ""));
    return Math.round((clp / CLP_TO_USD_RATE) * 100) / 100;
  }

  const bare = Number(s.replace(/[^\d.]/g, ""));
  return Number.isFinite(bare) && bare > 0 ? bare : null;
}

// Convierte una venta capturada en vivo en OLTP (producto/sucursal/cantidad,
// sin monto) en una fila "sucia" más para el lote de extracción: precio real
// del catálogo, formato de fecha y moneda alternado de forma determinística
// según el id (no aleatorio, para que el ensayo sea reproducible).
export function toDirtyRow(transaccion) {
  const producto = PRODUCTOS.find((p) => p.nombre === transaccion.producto);
  const precio = producto?.precioUnitario ?? 3;
  const montoUSD = Math.round(transaccion.cantidad * precio * 100) / 100;
  const useCLP = transaccion.id % 2 === 0;
  const monto = useCLP
    ? `$${Math.round(montoUSD * CLP_TO_USD_RATE).toLocaleString("es-CL")} CLP`
    : `USD ${montoUSD.toFixed(2)}`;

  const fechaObj = new Date(transaccion.timestamp);
  const formatter = DATE_FORMATTERS[transaccion.id % DATE_FORMATTERS.length];

  return {
    id: `live-${transaccion.id}`,
    fecha: formatter(fechaObj),
    sucursal: transaccion.sucursal,
    producto: transaccion.producto,
    monto,
    cantidad: transaccion.cantidad,
    // Cada venta en vivo es un evento genuinamente nuevo — nunca debe
    // confundirse con un duplicado, a diferencia de la semilla pedagógica.
    _dedupeKey: `live-${transaccion.id}`,
  };
}

// Limpia, deduplica y reporta calidad sobre un lote crudo — mismo espíritu que
// ETLReport del proyecto de referencia.
export function runETL(rawPool) {
  const rawRows = rawPool.length;

  const parsed = rawPool.map((row) => {
    const fecha = parseFecha(row.fecha);
    const sucursal = resolveSucursal(row.sucursal);
    const producto = resolveProducto(row.producto);
    const monto = parseMonto(row.monto);
    const cantidad = Number(row.cantidad);
    const valid = Boolean(fecha && sucursal && producto && monto > 0 && cantidad > 0);
    const dedupeKey = row._dedupeKey ?? `${fecha}|${sucursal}|${producto}|${cantidad}`;
    return { id: row.id, fecha, sucursal, producto, monto, cantidad, valid, dedupeKey };
  });

  const validRows = parsed.filter((r) => r.valid);
  const removedInvalid = parsed.length - validRows.length;

  const seen = new Set();
  const deduped = [];
  for (const row of validRows) {
    if (seen.has(row.dedupeKey)) continue;
    seen.add(row.dedupeKey);
    deduped.push(row);
  }
  const removedDuplicates = validRows.length - deduped.length;

  const cleaned = deduped
    .map(({ id, fecha, sucursal, producto, monto, cantidad }) => ({ id, fecha, sucursal, producto, monto, cantidad }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  return {
    cleaned,
    report: {
      rawRows,
      cleanedRows: cleaned.length,
      removedDuplicates,
      removedInvalid,
      totalSales: Math.round(cleaned.reduce((sum, r) => sum + r.monto, 0) * 100) / 100,
    },
  };
}

// Proyecta el warehouse "en vivo" (solo filas con origen OLTP, no la semilla
// pedagógica) hacia la forma que usa OLAP_DATA, para que una venta registrada
// durante la charla mueva de verdad el total que se ve más adelante en OLAP.
export function mapWarehouseToOlapRows(warehouse) {
  return warehouse
    .filter((row) => String(row.id).startsWith("live-"))
    .map((row) => {
      const sucursal = SUCURSALES.find((s) => s.id === row.sucursal);
      const producto = PRODUCTOS.find((p) => p.id === row.producto);
      if (!sucursal || !producto) return null;
      return {
        region: sucursal.region,
        producto: producto.categoria,
        trimestre: "T4 2025",
        mes: "Diciembre",
        ventas: row.monto,
      };
    })
    .filter(Boolean);
}
