import { motion } from "framer-motion";
import { BookOpen, Target, PlayCircle } from "lucide-react";
import Panel from "./Panel";
import Button from "./Button";

// Teaching scaffold shown before every pillar's interactive demo:
// 01 Definición → 02 Aplicación en Multimarket → 03 CTA into the practice.
export default function ConceptIntro({ definition, application, ctaLabel = "Comenzar práctica", onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Panel accent="slate-400" texture="dots" className="flex h-full flex-col gap-3 p-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-slate-400">01</span>
              <BookOpen size={16} className="text-slate-500" strokeWidth={2} />
              <h3 className="font-display text-base font-bold uppercase tracking-wide text-slate-700">Definición</h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600">{definition}</p>
          </Panel>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Panel accent="accent-600" tone="slate" texture="grid-animated" className="flex h-full flex-col gap-3 p-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-accent-600">02</span>
              <Target size={16} className="text-accent-700" strokeWidth={2} />
              <h3 className="font-display text-base font-bold uppercase tracking-wide text-accent-800">
                En Multimarket
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-700">{application}</p>
          </Panel>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-2 pt-2"
      >
        <span className="font-mono text-[11px] font-semibold text-slate-400">03 · PRÁCTICA</span>
        <Button variant="primary" icon={PlayCircle} onClick={onStart}>
          {ctaLabel}
        </Button>
      </motion.div>
    </motion.div>
  );
}
