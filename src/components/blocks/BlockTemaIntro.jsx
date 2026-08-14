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
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Cómo llegamos hasta aquí"
        title="Una historia de datos"
        subtitle="Antes de entrar al caso, un poco de historia: así fue como Multimarket llegó a necesitar un Data Warehouse."
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
              className="relative flex gap-4 pb-9"
            >
              {!isLast && (
                <span className="absolute left-3.75 top-8 h-full w-px bg-slate-200" aria-hidden="true" />
              )}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white ${
                  isLast ? "border-accent-700 text-accent-700" : "border-accent-600 text-accent-600"
                }`}
              >
                <Icon size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-1 flex-col gap-1 border-b border-slate-100 pb-7">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-600">
                  {etapa.anio}
                </span>
                <p className="font-display text-lg font-bold text-slate-900">{etapa.titulo}</p>
                <p className="text-base leading-relaxed text-slate-600">{etapa.detalle}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: HISTORIA.length * 0.15 + 0.1 }}
        className="flex justify-center pt-2"
      >
        <Button variant="primary" icon={ArrowRight} onClick={next}>
          Conocer el caso: Multimarket
        </Button>
      </motion.div>
    </div>
  );
}
