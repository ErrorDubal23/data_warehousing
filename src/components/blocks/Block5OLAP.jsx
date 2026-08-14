import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";
import { SlidersHorizontal, Rows3, TrendingUp, BookOpen, Activity, ChartPie } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { OLAP_DATA, REGIONES, TRIMESTRES, MESES_POR_TRIMESTRE } from "../../data/mockData";
import { mapWarehouseToOlapRows } from "../../lib/etl";
import Panel from "../ui/Panel";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import ConceptIntro from "../ui/ConceptIntro";
import AnimatedNumber from "../ui/AnimatedNumber";

const PRODUCTOS_OLAP = ["Todos", "Lácteos", "Bebidas", "Abarrotes", "Limpieza", "Panadería"];

// Fixed categorical order — validated 5-slot palette (blue/orange/aqua/yellow/magenta),
// assigned once per category and never re-cycled by filter state.
const CATEGORY_COLORS = {
  Lácteos: "#2a78d6",
  Bebidas: "#eb6834",
  Abarrotes: "#1baf7a",
  Limpieza: "#eda100",
  Panadería: "#e87ba4",
};

const MESES_CRONOLOGICOS = TRIMESTRES.flatMap((t) => MESES_POR_TRIMESTRE[t]);

const usd = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-accent-600"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className="font-display text-sm font-bold text-slate-900">{usd(payload[0].value)}</p>
    </div>
  );
}

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">{name}</p>
      <p className="font-display text-sm font-bold text-slate-900">{usd(value)}</p>
    </div>
  );
}

export default function Block5OLAP() {
  const [phase, setPhase] = useState("concept");
  const filters = useAppStore((s) => s.olapFilters);
  const setOlapFilter = useAppStore((s) => s.setOlapFilter);
  const drillDown = useAppStore((s) => s.drillDown);
  const toggleDrillDown = useAppStore((s) => s.toggleDrillDown);
  const warehouse = useAppStore((s) => s.warehouse);

  // El histórico curado (OLAP_DATA) le da sustancia a la tendencia trimestral;
  // las ventas registradas en vivo durante la charla se suman encima, así una
  // venta que acabas de registrar en OLTP mueve de verdad este número.
  const liveContribution = useMemo(() => mapWarehouseToOlapRows(warehouse), [warehouse]);
  const effectiveData = useMemo(() => [...OLAP_DATA, ...liveContribution], [liveContribution]);

  const matches = useCallback(
    (row) => row.region === filters.region && (filters.producto === "Todos" || row.producto === filters.producto),
    [filters]
  );

  const chartData = useMemo(() => {
    return TRIMESTRES.flatMap((trimestre) => {
      const isSelected = trimestre === filters.trimestre;
      if (isSelected && drillDown) {
        return MESES_POR_TRIMESTRE[trimestre].map((mes) => ({
          name: mes,
          ventas: effectiveData.filter((r) => matches(r) && r.trimestre === trimestre && r.mes === mes).reduce(
            (a, r) => a + r.ventas,
            0
          ),
          selected: true,
        }));
      }
      return [
        {
          name: trimestre,
          ventas: effectiveData.filter((r) => matches(r) && r.trimestre === trimestre).reduce((a, r) => a + r.ventas, 0),
          selected: isSelected,
        },
      ];
    });
  }, [filters, drillDown, matches, effectiveData]);

  const heroTotal = useMemo(
    () =>
      effectiveData.filter((r) => matches(r) && r.trimestre === filters.trimestre).reduce((a, r) => a + r.ventas, 0),
    [filters, matches, effectiveData]
  );

  // Tendencia mensual — respeta región/producto pero recorre el año completo,
  // independiente del trimestre seleccionado (esa acotación ya la cubre el bar chart).
  const monthlyTrend = useMemo(
    () =>
      MESES_CRONOLOGICOS.map((mes) => ({
        mes,
        ventas: effectiveData.filter((r) => matches(r) && r.mes === mes).reduce((a, r) => a + r.ventas, 0),
      })),
    [matches, effectiveData]
  );

  // Participación por categoría — respeta región/trimestre; ignora el filtro de
  // producto a propósito, para poder mostrar cómo se reparte el total entre categorías.
  const categoryShare = useMemo(() => {
    const byCategoria = effectiveData.filter((r) => r.region === filters.region && r.trimestre === filters.trimestre).reduce(
      (acc, r) => {
        acc[r.producto] = (acc[r.producto] ?? 0) + r.ventas;
        return acc;
      },
      {}
    );
    return Object.entries(byCategoria).map(([producto, ventas]) => ({ name: producto, value: ventas }));
  }, [filters.region, filters.trimestre, effectiveData]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Bloque 4 del pipeline · Análisis"
        title="OLAP — Análisis Multidimensional"
        subtitle="Con los datos ya modelados, cualquier corte de negocio está a un clic: región, producto, tiempo."
      />

      <AnimatePresence mode="wait">
        {phase === "concept" ? (
          <ConceptIntro
            key="concept"
            definition="OLAP (Online Analytical Processing) permite explorar datos multidimensionales de forma interactiva: filtrar, agregar y hacer drill-down sin escribir una sola consulta SQL. Está optimizado para preguntas de negocio, no para transacciones."
            application="Con el Data Warehouse ya poblado, un analista de Multimarket puede responder en segundos la pregunta que abrió esta demostración: cuánto se vendió, en qué región, en qué trimestre — y bajar hasta el detalle mensual con un clic."
            ventajas={[
              "Permite explorar cualquier combinación de dimensiones sin escribir SQL.",
              "Las consultas agregadas son rápidas incluso sobre millones de registros.",
              "El drill-down / roll-up da contexto inmediato, de lo general a lo específico.",
            ]}
            desventajas={[
              "No sirve para transacciones — no se usa para registrar una venta.",
              "Los cubos y agregaciones precalculadas pueden ocupar mucho espacio en disco.",
              "Si el ETL falla o se atrasa, el análisis queda desactualizado.",
            ]}
            ctaLabel="Comenzar práctica: responder la pregunta"
            onStart={() => setPhase("practice")}
          />
        ) : (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <button
              onClick={() => setPhase("concept")}
              className="flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400 transition-colors hover:text-accent-700"
            >
              <BookOpen size={12} strokeWidth={2} />
              Volver a la definición
            </button>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Panel accent="accent-600" tone="slate" texture="grid-animated" className="flex flex-col gap-2 p-6">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent-600">
                  Respondiendo la pregunta original
                </p>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-display text-4xl font-bold text-slate-900">
                    <AnimatedNumber value={heroTotal} formatter={usd} />
                  </span>
                  <span className="text-sm text-slate-600">
                    vendidos en <strong className="text-slate-800">Región {filters.region}</strong> durante{" "}
                    <strong className="text-slate-800">{filters.trimestre}</strong>
                    {filters.producto !== "Todos" && (
                      <>
                        {" "}
                        · categoría <strong className="text-slate-800">{filters.producto}</strong>
                      </>
                    )}
                  </span>
                </div>
              </Panel>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <Panel accent="accent-600" className="flex flex-col gap-5 p-5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-accent-700" strokeWidth={2} />
                    <h3 className="font-display text-sm font-bold text-slate-900">Filtros</h3>
                  </div>
                  <Select
                    label="Región"
                    value={filters.region}
                    onChange={(v) => setOlapFilter("region", v)}
                    options={REGIONES}
                  />
                  <Select
                    label="Producto"
                    value={filters.producto}
                    onChange={(v) => setOlapFilter("producto", v)}
                    options={PRODUCTOS_OLAP}
                  />
                  <Select
                    label="Trimestre"
                    value={filters.trimestre}
                    onChange={(v) => setOlapFilter("trimestre", v)}
                    options={TRIMESTRES}
                  />
                  <Button
                    variant={drillDown ? "primary" : "secondary"}
                    icon={Rows3}
                    onClick={toggleDrillDown}
                    className="justify-center"
                  >
                    {drillDown ? "Volver a trimestre" : "Drill-down mensual"}
                  </Button>
                </Panel>
              </div>

              <div className="lg:col-span-3">
                <Panel accent="accent-600" className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-accent-700" strokeWidth={2} />
                    <h3 className="font-display text-sm font-bold text-slate-900">
                      Ventas por {drillDown ? "mes" : "trimestre"}
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontFamily: "JetBrains Mono", fontSize: 11, fill: "var(--color-slate-500)" }}
                        axisLine={{ stroke: "var(--color-slate-300)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontFamily: "JetBrains Mono", fontSize: 11, fill: "var(--color-slate-500)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-slate-100)" }} />
                      <Bar dataKey="ventas" radius={[2, 2, 0, 0]} animationDuration={500}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.selected ? "var(--color-accent-600)" : "var(--color-slate-300)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Panel accent="accent-600" className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-accent-700" strokeWidth={2} />
                  <h3 className="font-display text-sm font-bold text-slate-900">Tendencia mensual</h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" vertical={false} />
                    <XAxis
                      dataKey="mes"
                      tickFormatter={(m) => m.slice(0, 3)}
                      tick={{ fontFamily: "JetBrains Mono", fontSize: 10, fill: "var(--color-slate-500)" }}
                      axisLine={{ stroke: "var(--color-slate-300)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontFamily: "JetBrains Mono", fontSize: 10, fill: "var(--color-slate-500)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                      width={44}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-slate-300)" }} />
                    <Line
                      type="monotone"
                      dataKey="ventas"
                      stroke="var(--color-accent-600)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "var(--color-accent-600)", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>

              <Panel accent="accent-600" className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <ChartPie size={16} className="text-accent-700" strokeWidth={2} />
                  <h3 className="font-display text-sm font-bold text-slate-900">Participación por categoría</h3>
                </div>
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <ResponsiveContainer width="100%" height={220} className="sm:flex-1">
                    <PieChart>
                      <Tooltip content={<CategoryTooltip />} />
                      <Pie
                        data={categoryShare}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        stroke="#ffffff"
                        strokeWidth={2}
                        animationDuration={500}
                      >
                        {categoryShare.map((entry) => (
                          <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? "var(--color-slate-300)"} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <ul className="flex flex-col gap-1.5 sm:w-40">
                    {categoryShare.map((entry) => (
                      <li key={entry.name} className="flex items-center gap-2 text-xs text-slate-600">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[entry.name] ?? "var(--color-slate-300)" }}
                        />
                        {entry.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
