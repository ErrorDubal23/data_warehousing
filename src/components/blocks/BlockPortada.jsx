import { motion } from "framer-motion";
import { ArrowRight, User, UserRoundPlus } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { CURSO, EQUIPO } from "../../data/mockData";
import Button from "../ui/Button";
import Panel from "../ui/Panel";
import logoUninorte from "../../assets/logo-uninorte.png";

export default function BlockPortada() {
  const next = useAppStore((s) => s.next);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <motion.img
        src={logoUninorte}
        alt={CURSO.universidad}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-16 w-auto"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-2"
      >
        <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent-600">
          {CURSO.materia} · {CURSO.universidad}
        </span>
        <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          {CURSO.titulo}
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600">{CURSO.subtitulo}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-2xl"
      >
        <Panel accent="accent-600" texture="dots" className="p-6">
          <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Equipo
          </p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EQUIPO.map((nombre, i) => (
              <motion.li
                key={nombre ?? `pendiente-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className={`flex items-center gap-2.5 border px-3 py-2.5 text-left ${
                  nombre ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50"
                }`}
              >
                {nombre ? (
                  <User size={15} className="shrink-0 text-accent-600" strokeWidth={2} />
                ) : (
                  <UserRoundPlus size={15} className="shrink-0 text-slate-400" strokeWidth={2} />
                )}
                <span className={`text-sm ${nombre ? "text-slate-800" : "italic text-slate-400"}`}>
                  {nombre ?? "Nombre por confirmar"}
                </span>
              </motion.li>
            ))}
          </ul>
        </Panel>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <Button variant="primary" icon={ArrowRight} onClick={next}>
          Comenzar
        </Button>
      </motion.div>
    </div>
  );
}
