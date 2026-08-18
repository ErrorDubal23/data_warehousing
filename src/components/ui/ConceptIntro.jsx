import { motion } from "framer-motion";
import { BookOpen, Target, CircleCheck, TriangleAlert, PlayCircle } from "lucide-react";
import Panel from "./Panel";
import Button from "./Button";

// Teaching scaffold shown before every pillar's interactive demo:
// 01 Definición → 02 Aplicación en Multimarket → 03 Ventajas/Desventajas → 04 CTA into the practice.
export default function ConceptIntro({
  definition,
  application,
  ventajas,
  desventajas,
  ctaLabel = "Comenzar práctica",
  onStart,
}) {
  const hasProsCons = ventajas?.length > 0 || desventajas?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 lg:gap-3"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-3">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Panel accent="slate-400" texture="dots" className="flex h-full flex-col gap-3 p-6 lg:gap-1.5 lg:p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-slate-400">01</span>
              <BookOpen size={16} className="text-slate-500" strokeWidth={2} />
              <h3 className="font-display text-base font-bold uppercase tracking-wide text-slate-700 lg:text-sm">
                Definición
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600 lg:text-xs lg:leading-snug">{definition}</p>
          </Panel>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Panel
            accent="accent-600"
            tone="slate"
            texture="grid-animated"
            className="flex h-full flex-col gap-3 p-6 lg:gap-1.5 lg:p-4"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-accent-600">02</span>
              <Target size={16} className="text-accent-700" strokeWidth={2} />
              <h3 className="font-display text-base font-bold uppercase tracking-wide text-accent-800 lg:text-sm">
                En Multimarket
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-700 lg:text-xs lg:leading-snug">{application}</p>
          </Panel>
        </motion.div>
      </div>

      {hasProsCons && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-3">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <Panel accent="signal-clean" className="flex h-full flex-col gap-3 p-6 lg:gap-1.5 lg:p-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-emerald-700">03</span>
                <CircleCheck size={16} className="text-emerald-600" strokeWidth={2} />
                <h3 className="font-display text-base font-bold uppercase tracking-wide text-emerald-800 lg:text-sm">
                  Ventajas
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5 lg:gap-1">
                {ventajas.map((v) => (
                  <li key={v} className="flex items-start gap-2.5 lg:gap-1.5">
                    <CircleCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" strokeWidth={2} />
                    <span className="text-sm leading-relaxed text-slate-700 lg:text-[11px] lg:leading-snug">{v}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Panel accent="signal-warn" className="flex h-full flex-col gap-3 p-6 lg:gap-1.5 lg:p-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-orange-700">03</span>
                <TriangleAlert size={16} className="text-orange-600" strokeWidth={2} />
                <h3 className="font-display text-base font-bold uppercase tracking-wide text-orange-800 lg:text-sm">
                  Desventajas
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5 lg:gap-1">
                {desventajas.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 lg:gap-1.5">
                    <TriangleAlert size={15} className="mt-0.5 shrink-0 text-orange-600" strokeWidth={2} />
                    <span className="text-sm leading-relaxed text-slate-700 lg:text-[11px] lg:leading-snug">{d}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: hasProsCons ? 0.45 : 0.3 }}
        className="flex flex-col items-center gap-2 pt-2 lg:gap-1 lg:pt-0"
      >
        <span className="font-mono text-[11px] font-semibold text-slate-400">
          {hasProsCons ? "04" : "03"} · PRÁCTICA
        </span>
        <Button variant="primary" icon={PlayCircle} onClick={onStart}>
          {ctaLabel}
        </Button>
      </motion.div>
    </motion.div>
  );
}
