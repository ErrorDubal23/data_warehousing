import { motion } from "framer-motion";
import { Server, ArrowRight, TriangleAlert, FileSpreadsheet, Hourglass, Compass } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import Button from "../ui/Button";
import Panel from "../ui/Panel";
import TiltCard from "../ui/TiltCard";
import SectionHeader from "../ui/SectionHeader";

const SUCURSALES_SILO = [
  { nombre: "Sucursal Norte", detalle: "Fechas en DD/MM/AAAA", moneda: "Precios en CLP" },
  { nombre: "Sucursal Centro", detalle: "Fechas en MM-DD-AAAA", moneda: "Precios en USD" },
  { nombre: "Sucursal Sur", detalle: "Fechas en AAAA.MM.DD", moneda: "Precios sin moneda" },
];

const CONSECUENCIAS = [
  { icon: FileSpreadsheet, texto: "Reportes armados a mano, cruzando Excel de cada sucursal." },
  { icon: Hourglass, texto: "Una consulta histórica simple toma días, no minutos." },
  { icon: Compass, texto: "Decisiones de inventario y expansión, a puro instinto." },
];

export default function Block1Intro() {
  const next = useAppStore((s) => s.next);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10 lg:w-full lg:gap-4 lg:py-4">
      <SectionHeader
        kicker="El problema que persiste"
        title="Multimarket"
        subtitle="Ya viste un sistema OLTP capturar una venta. El problema es que Multimarket no tiene solo uno."
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl text-base leading-relaxed text-slate-600 lg:text-sm lg:leading-snug"
      >
        Multiplica esa caja registradora por cada sucursal: Multimarket tiene presencia en cuatro regiones, y cada
        una opera con su propio sistema OLTP, como si fuera la única tienda del mundo — su propio punto de venta, su
        propio formato de fecha, sin ninguna integración entre sí.
      </motion.p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-3">
        {SUCURSALES_SILO.map((suc, i) => (
          <motion.div
            key={suc.nombre}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <TiltCard
              accent="signal-dirty"
              className="h-full"
              badge={
                <motion.div
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                >
                  <TriangleAlert className="text-signal-dirty" size={16} strokeWidth={2} />
                </motion.div>
              }
            >
              <div className="flex h-full flex-col gap-3 p-5 lg:gap-1.5 lg:p-3">
                <Server className="text-slate-400 lg:hidden" size={22} strokeWidth={1.5} />
                <p className="font-display text-sm font-bold text-slate-800 lg:text-sm">{suc.nombre}</p>
                <div className="flex flex-col gap-1 font-mono text-xs text-slate-500 lg:text-[11px]">
                  <span>{suc.detalle}</span>
                  <span>{suc.moneda}</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <Panel accent="signal-warn" className="p-5 lg:p-3">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400 lg:mb-1.5">
            El costo de operar así
          </p>
          <ul className="flex flex-col gap-3 lg:gap-1">
            {CONSECUENCIAS.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.texto} className="flex items-start gap-3 lg:gap-1.5">
                  <Icon size={16} className="mt-0.5 shrink-0 text-signal-warn" strokeWidth={2} />
                  <span className="text-sm leading-relaxed text-slate-700 lg:text-xs lg:leading-snug">
                    {c.texto}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Panel accent="accent-600" tone="slate" texture="grid-animated" className="p-8 lg:p-3">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent-600">
            La pregunta que nadie puede responder
          </p>
          <p className="mt-3 font-display text-2xl font-bold leading-snug text-slate-900 sm:text-3xl lg:mt-1 lg:text-lg">
            "¿Cuánto vendimos el trimestre pasado en la región norte?"
          </p>
        </Panel>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        className="text-center text-sm text-slate-500 lg:text-sm"
      >
        La pregunta que llevó a Multimarket a proponer el modelo OLAP en los 90. Ya capturamos el dato — ahora falta
        limpiarlo, consolidarlo y responderla.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center"
      >
        <Button variant="primary" icon={ArrowRight} onClick={next}>
          Continuar con ETL
        </Button>
      </motion.div>
    </div>
  );
}
