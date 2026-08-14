import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Workflow, Boxes, BarChart3, MessageCircleQuestion } from "lucide-react";
import { COMPARISON_ROWS } from "../../data/mockData";
import Panel from "../ui/Panel";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

const COLUMNS = [
  { key: "oltp", label: "OLTP", icon: Database, tone: "text-slate-700" },
  { key: "etl", label: "ETL", icon: Workflow, tone: "text-slate-700" },
  { key: "dw", label: "Data Warehouse", icon: Boxes, tone: "text-slate-700" },
  { key: "olap", label: "OLAP", icon: BarChart3, tone: "text-accent-800" },
];

export default function Block6Closing() {
  const [openQuestions, setOpenQuestions] = useState(false);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Síntesis"
        title="El pipeline, de punta a punta"
        subtitle="Un mismo dato, cuatro roles distintos: capturarlo, limpiarlo, guardarlo y comprenderlo."
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl text-base leading-relaxed text-slate-600"
      >
        Gracias a este modelo, Multimarket pasó de operar sucursal por sucursal a tener una sola fuente de verdad —
        el mismo salto que, décadas después, le permitió expandirse a todo el país y, más tarde, cruzar fronteras sin
        perder visibilidad del negocio.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="overflow-x-auto"
      >
        <Panel accent="accent-600" className="min-w-180 overflow-hidden p-0">
          <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50">
            <div className="px-4 py-4" />
            {COLUMNS.map((col, i) => {
              const Icon = col.icon;
              return (
                <div key={col.key} className="flex items-center gap-2 border-l border-slate-200 px-4 py-4">
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
              <div className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {row.label}
              </div>
              {COLUMNS.map((col) => (
                <div
                  key={col.key}
                  className={`border-l border-slate-100 px-4 py-3.5 font-mono text-[12px] leading-relaxed text-slate-700 ${
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

      <div className="flex flex-col items-center gap-6 pt-4">
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
              <Panel accent="accent-600" tone="slate" texture="dots" className="p-6 text-center">
                <p className="font-display text-base font-bold text-slate-900">Gracias por su atención</p>
                <p className="mt-1 text-sm text-slate-600">El pipeline OLTP → ETL → Data Warehouse → OLAP queda abierto a preguntas.</p>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
