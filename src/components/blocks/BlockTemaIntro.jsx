import { motion } from "framer-motion";
import { Database, Workflow, Boxes, BarChart3, ArrowRight, ChevronRight } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import Button from "../ui/Button";
import Panel from "../ui/Panel";
import SectionHeader from "../ui/SectionHeader";

const PILARES = [
  { icon: Database, nombre: "OLTP", detalle: "Captura la operación diaria, transacción por transacción." },
  { icon: Workflow, nombre: "ETL", detalle: "Extrae, limpia y estandariza los datos dispersos." },
  { icon: Boxes, nombre: "Data Warehouse", detalle: "Los organiza en un modelo dimensional listo para análisis." },
  { icon: BarChart3, nombre: "OLAP", detalle: "Los explora de forma interactiva para responder preguntas." },
];

export default function BlockTemaIntro() {
  const next = useAppStore((s) => s.next);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Introducción al tema"
        title="¿Qué es el Data Warehousing?"
        subtitle="Antes de entrar al caso práctico, conviene entender el concepto que conecta todo el pipeline que vamos a recorrer."
      />

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Panel accent="accent-600" texture="dots" className="p-6">
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            El <strong className="text-slate-900">Data Warehousing</strong> es la disciplina de la ingeniería de
            datos que consolida información dispersa en múltiples sistemas operacionales dentro de un repositorio
            centralizado, modelado específicamente para el análisis. Su objetivo no es procesar transacciones, sino
            responder preguntas: permite que una organización pase de mirar el dato aislado del día a día a
            comprender tendencias, comparar periodos y tomar decisiones informadas.
          </p>
        </Panel>
      </motion.div>

      <div className="flex flex-col gap-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400"
        >
          Los cuatro pilares que vamos a recorrer
        </motion.p>
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
          {PILARES.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.nombre}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="flex flex-1 items-stretch gap-2"
              >
                <Panel accent="accent-600" className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-accent-600 bg-white text-accent-700">
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <p className="font-display text-base font-bold text-slate-900">{p.nombre}</p>
                  <p className="text-sm leading-relaxed text-slate-500">{p.detalle}</p>
                </Panel>
                {i < PILARES.length - 1 && (
                  <div className="hidden items-center text-slate-300 md:flex">
                    <ChevronRight size={18} strokeWidth={2} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex justify-center pt-2"
      >
        <Button variant="primary" icon={ArrowRight} onClick={next}>
          Conocer el caso: Multimarket
        </Button>
      </motion.div>
    </div>
  );
}
