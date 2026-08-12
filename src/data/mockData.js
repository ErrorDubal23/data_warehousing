// ---------------------------------------------------------------------------
// Multimarket — Mock data layer
// Models the journey of a single sale from OLTP capture through ETL cleaning
// into a star-schema Data Warehouse queried by OLAP.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Portada — curso, equipo y cronograma de la exposición
// ---------------------------------------------------------------------------
export const CURSO = {
  materia: "Base de Datos",
  universidad: "Universidad del Norte",
  titulo: "Multimarket",
  subtitulo: "Data Warehousing: de la operación diaria a la decisión estratégica",
};

export const EQUIPO = [
  "Dubal Antonio Aguilar Torres",
  "Carlos Calbria Patiño",
  "Angelo de Leon",
  "Mateo Cisneros",
  null,
];

export const AGENDA = [
  {
    icon: "flag",
    titulo: "Introducción",
    detalle: "El origen del problema de negocio",
    minutos: 2,
  },
  {
    icon: "database",
    titulo: "OLTP",
    detalle: "Sistema transaccional — la captura",
    minutos: 3,
  },
  {
    icon: "workflow",
    titulo: "ETL",
    detalle: "Extract, Transform, Load — la limpieza",
    minutos: 4,
  },
  {
    icon: "boxes",
    titulo: "Data Warehouse",
    detalle: "Modelado dimensional — esquema estrella",
    minutos: 4,
  },
  {
    icon: "chart",
    titulo: "OLAP",
    detalle: "Análisis multidimensional — la respuesta",
    minutos: 4,
  },
  {
    icon: "question",
    titulo: "Cierre y preguntas",
    detalle: "Síntesis OLTP vs. OLAP",
    minutos: 3,
  },
];

export const SUCURSALES = [
  { id: "SUC-N1", nombre: "Sucursal Norte 1", region: "Norte" },
  { id: "SUC-N2", nombre: "Sucursal Norte 2", region: "Norte" },
  { id: "SUC-C1", nombre: "Sucursal Centro 1", region: "Centro" },
  { id: "SUC-S1", nombre: "Sucursal Sur 1", region: "Sur" },
  { id: "SUC-E1", nombre: "Sucursal Este 1", region: "Este" },
];

export const PRODUCTOS = [
  { id: "PRD-001", nombre: "Leche Entera 1L", categoria: "Lácteos", marca: "ProCampo" },
  { id: "PRD-002", nombre: "Bebida Cola 1.5L", categoria: "Bebidas", marca: "FreshCola" },
  { id: "PRD-003", nombre: "Arroz Grado 1 1kg", categoria: "Abarrotes", marca: "Sureño" },
  { id: "PRD-004", nombre: "Detergente 3kg", categoria: "Limpieza", marca: "Limpex" },
  { id: "PRD-005", nombre: "Pan de Molde", categoria: "Panadería", marca: "Trigal" },
];

// Transactions already "captured" before the demo starts, so the OLTP
// table doesn't render empty. Each row is an isolated event — no aggregation.
export const OLTP_SEED = [
  { id: 1, timestamp: "2026-08-11T09:14:02", producto: "Leche Entera 1L", sucursal: "Sucursal Norte 1", cantidad: 4 },
  { id: 2, timestamp: "2026-08-11T09:16:47", producto: "Arroz Grado 1 1kg", sucursal: "Sucursal Centro 1", cantidad: 2 },
  { id: 3, timestamp: "2026-08-11T09:21:33", producto: "Bebida Cola 1.5L", sucursal: "Sucursal Sur 1", cantidad: 6 },
  { id: 4, timestamp: "2026-08-11T09:24:10", producto: "Pan de Molde", sucursal: "Sucursal Este 1", cantidad: 3 },
];

// ---------------------------------------------------------------------------
// ETL — Extract: raw data as it actually arrives from disconnected silos.
// Deliberately inconsistent: mixed date formats, mixed currencies, a
// duplicate record, and inconsistent branch naming.
// ---------------------------------------------------------------------------
export const ETL_DIRTY = [
  { id: "a1", fecha: "14/09/2025", sucursal: "Suc. Norte 01", producto: "Leche Entera 1L", monto: "$45.990 CLP", cantidad: 12 },
  { id: "a2", fecha: "2025-09-14", sucursal: "Sucursal Norte 1", producto: "Leche Entera 1L", monto: "$45.990 CLP", cantidad: 12 }, // duplicate of a1
  { id: "a3", fecha: "09-15-2025", sucursal: "Sucursal Centro 1", producto: "Arroz Grado 1 1kg", monto: "USD 58.30", cantidad: 20 },
  { id: "a4", fecha: "16/09/2025", sucursal: "Suc. Sur", producto: "Bebida Cola 1.5L", monto: "$61.500 CLP", cantidad: 30 },
  { id: "a5", fecha: "2025.09.17", sucursal: "Sucursal Este 1", producto: "Pan de Molde", monto: "USD 24.10", cantidad: 15 },
];

// ETL — Transform + Load: same records, standardized to ISO-8601 dates,
// unified USD amounts, deduplicated, and mapped to canonical branch codes.
export const ETL_CLEAN = [
  { id: "a1", fecha: "2025-09-14", sucursal: "SUC-N1", producto: "PRD-001", monto: 52.4, cantidad: 12 },
  { id: "a3", fecha: "2025-09-15", sucursal: "SUC-C1", producto: "PRD-003", monto: 58.3, cantidad: 20 },
  { id: "a4", fecha: "2025-09-16", sucursal: "SUC-S1", producto: "PRD-002", monto: 66.7, cantidad: 30 },
  { id: "a5", fecha: "2025-09-17", sucursal: "SUC-E1", producto: "PRD-005", monto: 24.1, cantidad: 15 },
];

// ---------------------------------------------------------------------------
// Data Warehouse — Star schema (Kimball): one fact table, four dimensions.
// ---------------------------------------------------------------------------
export const FACT_TABLE = {
  id: "fact",
  name: "Hechos_Ventas",
  subtitle: "Tabla de hechos",
  columns: [
    { name: "id_venta", type: "PK", desc: "Identificador único del hecho" },
    { name: "id_producto", type: "FK", desc: "Referencia a Dim_Producto" },
    { name: "id_tienda", type: "FK", desc: "Referencia a Dim_Tienda" },
    { name: "id_tiempo", type: "FK", desc: "Referencia a Dim_Tiempo" },
    { name: "id_cliente", type: "FK", desc: "Referencia a Dim_Cliente" },
    { name: "cantidad", type: "MÉTRICA", desc: "Unidades vendidas" },
    { name: "monto_usd", type: "MÉTRICA", desc: "Monto de venta, USD" },
    { name: "costo_usd", type: "MÉTRICA", desc: "Costo asociado, USD" },
  ],
};

export const DIMENSIONS = [
  {
    id: "producto",
    name: "Dim_Producto",
    label: "Producto",
    icon: "package",
    position: "top",
    columns: [
      { name: "id_producto", type: "PK" },
      { name: "nombre", type: "STRING" },
      { name: "categoria", type: "STRING" },
      { name: "marca", type: "STRING" },
    ],
  },
  {
    id: "tienda",
    name: "Dim_Tienda",
    label: "Tienda",
    icon: "store",
    position: "right",
    columns: [
      { name: "id_tienda", type: "PK" },
      { name: "nombre", type: "STRING" },
      { name: "region", type: "STRING" },
      { name: "ciudad", type: "STRING" },
    ],
  },
  {
    id: "tiempo",
    name: "Dim_Tiempo",
    label: "Tiempo",
    icon: "calendar",
    position: "bottom",
    columns: [
      { name: "id_tiempo", type: "PK" },
      { name: "fecha", type: "DATE" },
      { name: "mes", type: "STRING" },
      { name: "trimestre", type: "STRING" },
      { name: "anio", type: "INT" },
    ],
  },
  {
    id: "cliente",
    name: "Dim_Cliente",
    label: "Cliente",
    icon: "users",
    position: "left",
    columns: [
      { name: "id_cliente", type: "PK" },
      { name: "nombre", type: "STRING" },
      { name: "segmento", type: "STRING" },
      { name: "region_origen", type: "STRING" },
    ],
  },
];

// ---------------------------------------------------------------------------
// OLAP — Multidimensional dataset. Deterministically generated (seeded PRNG)
// so the numbers are stable across renders while covering every
// region × producto × trimestre × mes combination needed for drill-down.
// ---------------------------------------------------------------------------
export const REGIONES = ["Norte", "Centro", "Sur", "Este"];
export const TRIMESTRES = ["T1 2025", "T2 2025", "T3 2025", "T4 2025"];
export const MESES_POR_TRIMESTRE = {
  "T1 2025": ["Enero", "Febrero", "Marzo"],
  "T2 2025": ["Abril", "Mayo", "Junio"],
  "T3 2025": ["Julio", "Agosto", "Septiembre"],
  "T4 2025": ["Octubre", "Noviembre", "Diciembre"],
};

const REGION_FACTOR = { Norte: 1.15, Centro: 1.3, Sur: 0.85, Este: 0.7 };
const PRODUCTO_BASE = {
  Lácteos: 42000,
  Bebidas: 51000,
  Abarrotes: 68000,
  Limpieza: 30000,
  Panadería: 25000,
};
const TRIMESTRE_GROWTH = { "T1 2025": 1, "T2 2025": 1.05, "T3 2025": 1.1, "T4 2025": 1.18 };

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildOlapData() {
  const rng = mulberry32(42);
  const rows = [];
  REGIONES.forEach((region) => {
    Object.keys(PRODUCTO_BASE).forEach((producto) => {
      TRIMESTRES.forEach((trimestre) => {
        const quarterTotal = Math.round(
          PRODUCTO_BASE[producto] * REGION_FACTOR[region] * TRIMESTRE_GROWTH[trimestre]
        );
        const meses = MESES_POR_TRIMESTRE[trimestre];
        const weights = meses.map(() => 0.7 + rng() * 0.6);
        const weightSum = weights.reduce((a, b) => a + b, 0);
        meses.forEach((mes, i) => {
          rows.push({
            region,
            producto,
            trimestre,
            mes,
            ventas: Math.round((quarterTotal * weights[i]) / weightSum),
          });
        });
      });
    });
  });
  return rows;
}

export const OLAP_DATA = buildOlapData();

// ---------------------------------------------------------------------------
// Closing block — OLTP vs OLAP conceptual comparison
// ---------------------------------------------------------------------------
export const COMPARISON_ROWS = [
  {
    label: "Propósito",
    oltp: "Soportar la operación diaria — capturar cada transacción",
    olap: "Soportar el análisis — responder preguntas estratégicas",
  },
  {
    label: "Operaciones típicas",
    oltp: "INSERT, UPDATE, DELETE de registros individuales",
    olap: "SELECT con agregaciones (SUM, AVG) y filtros multidimensionales",
  },
  {
    label: "Estructura de datos",
    oltp: "Normalizada, muchas tablas pequeñas, integridad transaccional",
    olap: "Desnormalizada, esquema estrella, optimizada para lectura",
  },
  {
    label: "Ejemplo de consulta",
    oltp: "INSERT INTO ventas (producto, sucursal, cantidad) VALUES (...)",
    olap: "SELECT SUM(monto_usd) WHERE region='Norte' AND trimestre='T4 2025'",
  },
];
