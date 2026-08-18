import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Workflow,
  Warehouse,
  BarChart3,
  MessageCircleQuestion,
  Store,
  Users,
  FileText,
  Radio,
} from "lucide-react";
import { COMPARISON_ROWS } from "../../data/mockData";
import Panel from "../ui/Panel";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

const COLUMNS = [
  { key: "oltp", label: "OLTP", icon: Database, tone: "text-slate-700" },
  { key: "etl", label: "ETL", icon: Workflow, tone: "text-slate-700" },
  { key: "dw", label: "Data Warehouse", icon: Warehouse, tone: "text-slate-700" },
  { key: "olap", label: "OLAP", icon: BarChart3, tone: "text-accent-800" },
];

const OLTP_SOURCES = [
  { icon: Store, label: "POS" },
  { icon: Users, label: "CRM" },
];

const OLAP_OUTPUTS = [
  { icon: BarChart3, label: "Dashboards" },
  { icon: FileText, label: "Reportes" },
];

const PACKET_COUNT = 3;

function FlowGroup({ items, title, accent }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-3 shadow-sm lg:px-3 lg:py-1.5 ${
        accent ? "border-accent-200 bg-accent-50/70" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex gap-2">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className={`flex flex-col items-center gap-1 border px-2.5 py-2 ${
              accent ? "border-accent-200 bg-white" : "border-slate-200 bg-slate-50"
            }`}
          >
            <Icon size={15} className={accent ? "text-accent-700" : "text-slate-500"} strokeWidth={2} />
            <span
              className={`font-mono text-[9px] uppercase tracking-wider ${accent ? "text-accent-700" : "text-slate-500"}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <span
        className={`font-mono text-xs font-bold uppercase tracking-wider ${accent ? "text-accent-800" : "text-slate-700"}`}
      >
        {title}
      </span>
    </div>
  );
}

function FlowHub({ icon: Icon, label, filled }) {
  return (
    <div
      className={`flex flex-col items-center gap-1.5 border px-3.5 py-3 lg:px-3 lg:py-1.5 ${
        filled
          ? "border-accent-700 bg-linear-to-b from-accent-700 to-accent-800 text-white shadow-md"
          : "border-accent-600 bg-white text-accent-700 shadow-sm"
      }`}
    >
      <Icon size={filled ? 19 : 17} strokeWidth={2} />
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

// A gradient connector (raw data on the left, fully modeled on the right)
// plus a stream of small dots animating left-to-right gives the row of
// static boxes an actual sense of data moving through the pipeline.
function FlowDiagram() {
  return (
    <Panel accent="accent-600" tone="slate" texture="grid-animated" className="overflow-hidden p-4 lg:p-2.5">
      <p className="mb-3 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-600 lg:mb-1.5">
        <Radio size={11} strokeWidth={2} />
        Flujo de datos, en vivo
      </p>
      <div className="relative flex items-center justify-center py-1 lg:py-0">
        <div
          className="pointer-events-none absolute inset-x-[7%] top-1/2 z-0 hidden h-px -translate-y-1/2 sm:block"
          style={{
            background:
              "linear-gradient(to right, var(--color-slate-300), var(--color-accent-500) 40%, var(--color-accent-800))",
          }}
        />
        {Array.from({ length: PACKET_COUNT }).map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute top-1/2 z-1 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-500 sm:block"
            style={{ boxShadow: "0 0 6px 1px var(--color-accent-400)" }}
            initial={{ left: "7%", opacity: 0 }}
            animate={{ left: ["7%", "93%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * (3 / PACKET_COUNT) }}
          />
        ))}

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 lg:gap-2">
          <FlowGroup items={OLTP_SOURCES} title="OLTP" />
          <FlowHub icon={Workflow} label="ETL" />
          <FlowHub icon={Warehouse} label="Data Warehouse" filled />
          <FlowGroup items={OLAP_OUTPUTS} title="OLAP" accent />
        </div>
      </div>
    </Panel>
  );
}

export default function Block6Closing() {
  const [openQuestions, setOpenQuestions] = useState(false);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 lg:w-full lg:gap-3 lg:py-4">
      <SectionHeader
        kicker="Síntesis"
        title="El pipeline, de punta a punta"
        subtitle="Un mismo dato, cuatro roles distintos: capturarlo, limpiarlo, guardarlo y comprenderlo."
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl text-base leading-relaxed text-slate-600 lg:text-sm lg:leading-snug"
      >
        Gracias a este modelo, Multimarket pasó de operar sucursal por sucursal a tener una sola fuente de verdad —
        el mismo salto que, décadas después, le permitió expandirse a todo el país y, más tarde, cruzar fronteras sin
        perder visibilidad del negocio.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col gap-3 lg:gap-2"
      >
        <p className="max-w-3xl text-base leading-relaxed text-slate-600 lg:text-sm lg:leading-snug">
          Capturar, limpiar, consolidar y analizar no son procesos aislados: son un mismo flujo de datos, de punta a
          punta. A ese ecosistema completo —sistemas operacionales, ETL, repositorio central y análisis— se le
          conoce como <strong className="text-slate-900">Data Warehousing</strong>.
        </p>

        <FlowDiagram />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="overflow-x-auto"
      >
        <Panel accent="accent-600" className="min-w-180 overflow-hidden p-0">
          <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50">
            <div className="px-4 py-3 lg:py-1.5" />
            {COLUMNS.map((col, i) => {
              const Icon = col.icon;
              return (
                <div
                  key={col.key}
                  className="flex items-center gap-2 border-l border-slate-200 px-4 py-3 lg:py-1.5"
                >
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  >
                    <Icon size={15} className={col.tone} strokeWidth={2} />
                  </motion.div>
                  <span className={`font-display text-xs font-bold sm:text-sm ${col.tone}`}>{col.label}</span>
                </div>
              );
            })}
          </div>
          {COMPARISON_ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="grid grid-cols-5 border-b border-slate-100 last:border-b-0"
            >
              <div className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 lg:py-1.5">
                {row.label}
              </div>
              {COLUMNS.map((col) => (
                <div
                  key={col.key}
                  className={`border-l border-slate-100 px-4 py-3 font-mono text-[12px] leading-relaxed text-slate-700 lg:py-1.5 lg:text-xs ${
                    col.key === "olap" ? "bg-accent-50/30" : ""
                  }`}
                >
                  {row[col.key]}
                </div>
              ))}
            </motion.div>
          ))}
        </Panel>
      </motion.div>

      <div className="flex flex-col items-center gap-6 pt-4 lg:gap-3 lg:pt-1">
        <Button variant="secondary" icon={MessageCircleQuestion} onClick={() => setOpenQuestions((v) => !v)}>
          Abrir espacio para preguntas
        </Button>
        <AnimatePresence>
          {openQuestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-md overflow-hidden"
            >
              <Panel accent="accent-600" tone="slate" texture="dots" className="p-6 text-center lg:p-2.5">
                <p className="font-display text-base font-bold text-slate-900 lg:text-sm">Gracias por su atención</p>
                <p className="mt-1 text-sm text-slate-600 lg:text-xs">
                  El pipeline OLTP → ETL → Data Warehouse → OLAP queda abierto a preguntas.
                </p>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
