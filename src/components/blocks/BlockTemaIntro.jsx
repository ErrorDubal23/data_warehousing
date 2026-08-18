import { motion } from "framer-motion";
import { NotebookPen, Database, TriangleAlert, Lightbulb, ArrowRight } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { HISTORIA } from "../../data/mockData";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

const ICONS = { notebook: NotebookPen, database: Database, alert: TriangleAlert, lightbulb: Lightbulb };

export default function BlockTemaIntro() {
  const next = useAppStore((s) => s.next);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-10 lg:w-full lg:gap-4 lg:py-4">
      <SectionHeader
        kicker="Cómo llegamos hasta aquí"
        title="Una historia de datos"
        subtitle="Un poco de historia antes de empezar: así fue como Multimarket llegó a necesitar un Data Warehouse."
      />

      <ol className="relative flex flex-col">
        {HISTORIA.map((etapa, i) => {
          const Icon = ICONS[etapa.icon];
          const isLast = i === HISTORIA.length - 1;
          return (
            <motion.li
              key={etapa.titulo}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative flex gap-4 pb-9 lg:gap-3 lg:pb-3"
            >
              {!isLast && (
                <span className="absolute left-3.75 top-8 h-full w-px bg-slate-200 lg:left-2.75 lg:top-6" aria-hidden="true" />
              )}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white lg:h-5.5 lg:w-5.5 ${
                  isLast ? "border-accent-700 text-accent-700" : "border-accent-600 text-accent-600"
                }`}
              >
                <Icon size={15} strokeWidth={2} className="lg:hidden" />
                <Icon size={11} strokeWidth={2} className="hidden lg:block" />
              </div>
              <div className="flex flex-1 flex-col gap-1 border-b border-slate-100 pb-7 lg:gap-0 lg:pb-2.5">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-600 lg:text-[11px]">
                  {etapa.anio}
                </span>
                <p className="font-display text-lg font-bold text-slate-900 lg:text-sm">{etapa.titulo}</p>
                <p className="text-base leading-relaxed text-slate-600 lg:text-sm lg:leading-snug">{etapa.detalle}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: HISTORIA.length * 0.15 + 0.1 }}
        className="flex justify-center pt-2 lg:pt-0"
      >
        <Button variant="primary" icon={ArrowRight} onClick={next}>
          Comenzar la demostración
        </Button>
      </motion.div>
    </div>
  );
}
