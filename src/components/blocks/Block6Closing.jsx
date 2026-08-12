import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, BarChart3, MessageCircleQuestion } from "lucide-react";
import { COMPARISON_ROWS } from "../../data/mockData";
import Panel from "../ui/Panel";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

export default function Block6Closing() {
  const [openQuestions, setOpenQuestions] = useState(false);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Síntesis"
        title="OLTP vs. OLAP"
        subtitle="El mismo dato, dos propósitos: capturar la operación y comprender el negocio."
      />

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      <Panel accent="accent-600" className="overflow-hidden p-0">
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">
          <div className="px-5 py-4" />
          <div className="flex items-center gap-2 border-l border-slate-200 px-5 py-4">
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
              <Database size={16} className="text-slate-500" strokeWidth={2} />
            </motion.div>
            <span className="font-display text-sm font-bold text-slate-800">OLTP</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 px-5 py-4">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <BarChart3 size={16} className="text-accent-700" strokeWidth={2} />
            </motion.div>
            <span className="font-display text-sm font-bold text-accent-800">OLAP</span>
          </div>
        </div>
        {COMPARISON_ROWS.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="grid grid-cols-3 border-b border-slate-100 last:border-b-0"
          >
            <div className="px-5 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
              {row.label}
            </div>
            <div className="border-l border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-700">
              {row.oltp}
            </div>
            <div className="border-l border-slate-100 bg-accent-50/30 px-5 py-4 font-mono text-[13px] leading-relaxed text-slate-700">
              {row.olap}
            </div>
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
