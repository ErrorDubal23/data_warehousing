import { motion } from "framer-motion";
import { Server, ArrowRight, TriangleAlert } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import Button from "../ui/Button";
import Panel from "../ui/Panel";
import SectionHeader from "../ui/SectionHeader";

const SUCURSALES_SILO = [
  { nombre: "Sucursal Norte", detalle: "Fechas en DD/MM/AAAA", moneda: "Precios en CLP" },
  { nombre: "Sucursal Centro", detalle: "Fechas en MM-DD-AAAA", moneda: "Precios en USD" },
  { nombre: "Sucursal Sur", detalle: "Fechas en AAAA.MM.DD", moneda: "Precios sin moneda" },
];

export default function Block1Intro() {
  const startTimer = useAppStore((s) => s.startTimer);
  const next = useAppStore((s) => s.next);

  const handleStart = () => {
    startTimer();
    next();
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10">
      <SectionHeader
        kicker="Caso de estudio · Cadena de retail"
        title="Multimarket"
        subtitle="Datos aislados en silos operacionales. Imposibilidad de responder preguntas estratégicas."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SUCURSALES_SILO.map((suc, i) => (
          <motion.div
            key={suc.nombre}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
          >
            <Panel accent="signal-dirty" texture="dots" className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Server className="text-slate-400" size={22} strokeWidth={1.5} />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                >
                  <TriangleAlert className="text-signal-dirty" size={16} strokeWidth={2} />
                </motion.div>
              </div>
              <p className="font-display text-sm font-bold text-slate-800">{suc.nombre}</p>
              <div className="flex flex-col gap-1 font-mono text-xs text-slate-500">
                <span>{suc.detalle}</span>
                <span>{suc.moneda}</span>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Panel accent="accent-600" tone="slate" texture="grid-animated" className="p-8">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent-600">
            La pregunta que nadie puede responder
          </p>
          <p className="mt-3 font-display text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
            "¿Cuánto vendimos el trimestre pasado en la región norte?"
          </p>
        </Panel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center"
      >
        <Button variant="primary" icon={ArrowRight} onClick={handleStart}>
          Comenzar Demostración
        </Button>
      </motion.div>
    </div>
  );
}
