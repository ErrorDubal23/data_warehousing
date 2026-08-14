import { motion } from "framer-motion";
import { Flag, Database, Workflow, Boxes, BarChart3, MessageCircleQuestion, ArrowRight, Clock } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { AGENDA } from "../../data/mockData";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

const ICONS = {
  flag: Flag,
  database: Database,
  workflow: Workflow,
  boxes: Boxes,
  chart: BarChart3,
  question: MessageCircleQuestion,
};

export default function BlockCronograma() {
  const next = useAppStore((s) => s.next);
  const total = AGENDA.reduce((a, item) => a + item.minutos, 0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Cronograma de la exposición"
        title={`Agenda — ${total} minutos`}
        subtitle="Recorremos el pipeline completo del dato: de la captura operacional a la decisión estratégica."
      />

      <ol className="relative flex flex-col">
        {AGENDA.map((item, i) => {
          const Icon = ICONS[item.icon];
          const isLast = i === AGENDA.length - 1;
          return (
            <motion.li
              key={item.titulo}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-4 pb-8"
            >
              {!isLast && (
                <span className="absolute left-3.75 top-8 h-full w-px bg-slate-200" aria-hidden="true" />
              )}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-600 bg-white text-accent-700">
                <Icon size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-slate-100 pb-6">
                <div>
                  <p className="font-display text-base font-bold text-slate-900">{item.titulo}</p>
                  <p className="text-sm text-slate-500">{item.detalle}</p>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-600">
                  <Clock size={12} strokeWidth={2} />
                  {item.minutos} min
                </span>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: AGENDA.length * 0.1 + 0.1 }}
        className="flex flex-col items-center gap-6 pt-2"
      >
        <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
          Total estimado · <span className="font-semibold text-slate-600">{total} minutos</span>
        </span>
        <Button variant="primary" icon={ArrowRight} onClick={next}>
          Continuar
        </Button>
      </motion.div>
    </div>
  );
}
