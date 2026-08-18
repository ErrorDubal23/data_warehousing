import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Database, PlusCircle, BookOpen, RotateCcw, ShieldCheck } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { PRODUCTOS, SUCURSALES } from "../../data/mockData";
import Button from "../ui/Button";
import Panel from "../ui/Panel";
import DataTable from "../ui/DataTable";
import SectionHeader from "../ui/SectionHeader";
import Badge from "../ui/Badge";
import ConceptIntro from "../ui/ConceptIntro";
import AnimatedNumber from "../ui/AnimatedNumber";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "timestamp", label: "Timestamp" },
  { key: "producto", label: "Producto" },
  { key: "sucursal", label: "Sucursal" },
  { key: "cantidad", label: "Cant." },
];

const ACID = [
  { letra: "A", nombre: "Atomicidad", detalle: "La venta se guarda completa o no se guarda — nunca a medias." },
  {
    letra: "C",
    nombre: "Consistencia",
    detalle: "El sistema nunca queda en un estado inválido después de la transacción.",
  },
  {
    letra: "I",
    nombre: "Aislamiento",
    detalle: "Miles de cajas pueden vender al mismo tiempo sin pisarse los datos entre sí.",
  },
  {
    letra: "D",
    nombre: "Durabilidad",
    detalle: "Una vez confirmada, la venta sobrevive incluso si el sistema falla justo después.",
  },
];

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-CL", { hour12: false }) + "." + String(d.getMilliseconds()).padStart(3, "0");
}

export default function Block2OLTP() {
  const [phase, setPhase] = useState("concept");
  const transactions = useAppStore((s) => s.transactions);
  const lastAddedId = useAppStore((s) => s.lastAddedId);
  const addTransaction = useAppStore((s) => s.addTransaction);
  const resetDemo = useAppStore((s) => s.resetDemo);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { producto: PRODUCTOS[0].nombre, sucursal: SUCURSALES[0].nombre, cantidad: 1 },
  });

  const onSubmit = (data) => {
    addTransaction({ ...data, cantidad: Number(data.cantidad) });
    reset({ producto: data.producto, sucursal: data.sucursal, cantidad: 1 });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Bloque 1 del pipeline · Captura"
        title="OLTP — Sistema Transaccional"
        subtitle="Cada venta se registra como un evento aislado en el momento en que ocurre. No hay agregación: solo la operación, fila por fila."
      />

      <AnimatePresence mode="wait">
        {phase === "concept" ? (
          <ConceptIntro
            key="concept"
            definition="Un sistema OLTP (Online Transaction Processing) está optimizado para procesar un alto volumen de transacciones cortas y frecuentes — inserciones, actualizaciones y eliminaciones puntuales. Prioriza la velocidad y la integridad de cada operación individual sobre el análisis histórico."
            application="Cada vez que una caja de Multimarket registra una venta, el sistema OLTP guarda esa transacción de forma aislada, sin calcular totales ni comparar sucursales. Es la capa operativa: rápida y precisa, pero ciega al panorama general del negocio."
            ventajas={[
              "Respuesta casi instantánea: cada transacción se confirma en milisegundos.",
              "Garantiza integridad mediante propiedades ACID — nunca queda una venta a medias.",
              "Soporta miles de usuarios concurrentes sin pisarse los datos entre sí.",
            ]}
            desventajas={[
              "No está pensado para preguntas agregadas — sumar un trimestre completo lo satura.",
              "La normalización que lo hace rápido para escribir lo hace lento para leer en bloque.",
              "Múltiples sistemas OLTP aislados (uno por sucursal) generan silos, como en este caso.",
            ]}
            ctaLabel="Comenzar práctica: registrar una venta"
            onStart={() => setPhase("practice")}
          />
        ) : (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setPhase("concept")}
                className="flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400 transition-colors hover:text-accent-700"
              >
                <BookOpen size={12} strokeWidth={2} />
                Volver a la definición
              </button>
              <button
                onClick={resetDemo}
                title="Vuelve el OLTP, el ETL y el OLAP al estado inicial de la demo"
                className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400 transition-colors hover:text-signal-warn"
              >
                <RotateCcw size={12} strokeWidth={2} />
                Reiniciar datos de demo
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Panel accent="accent-600" className="p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <Database className="text-accent-700" size={18} strokeWidth={2} />
                    <h3 className="font-display text-base font-bold text-slate-900">Nueva transacción</h3>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                        Producto
                      </label>
                      <select
                        {...register("producto", { required: true })}
                        className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-accent-600"
                      >
                        {PRODUCTOS.map((p) => (
                          <option key={p.id} value={p.nombre}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                        Sucursal
                      </label>
                      <select
                        {...register("sucursal", { required: true })}
                        className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-accent-600"
                      >
                        {SUCURSALES.map((s) => (
                          <option key={s.id} value={s.nombre}>
                            {s.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min={1}
                        {...register("cantidad", { required: true, min: 1, valueAsNumber: true })}
                        className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-accent-600"
                      />
                      {errors.cantidad && (
                        <span className="text-xs text-signal-warn">Ingresa una cantidad válida.</span>
                      )}
                    </div>

                    <Button type="submit" variant="primary" icon={PlusCircle} className="mt-2 justify-center">
                      Registrar Venta
                    </Button>
                  </form>
                </Panel>

                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  Cada fila de la derecha es un evento independiente: sin totales, sin cruces entre sucursales, sin
                  contexto histórico. Así opera un sistema OLTP.
                </p>
              </div>

              <div className="lg:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                    Tabla_Ventas
                    <Badge tone="accent">en vivo</Badge>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    <AnimatedNumber value={transactions.length} /> registros
                  </span>
                </div>
                <DataTable columns={COLUMNS} maxHeight="26rem">
                  <AnimatePresence initial={false}>
                    {transactions.map((tx) => {
                      const isNew = tx.id === lastAddedId;
                      return (
                        <motion.tr
                          key={tx.id}
                          layout
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35 }}
                          className={`transition-colors duration-1800 ${isNew ? "bg-emerald-50" : "bg-transparent"}`}
                          style={{
                            borderLeft: isNew ? "3px solid var(--color-signal-clean)" : "3px solid transparent",
                          }}
                        >
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{tx.id}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-600">
                            {formatTimestamp(tx.timestamp)}
                          </td>
                          <td className="px-4 py-2.5 text-sm text-slate-800">{tx.producto}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600">{tx.sucursal}</td>
                          <td className="px-4 py-2.5 font-mono text-sm text-slate-800">{tx.cantidad}</td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </DataTable>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Panel accent="accent-600" className="p-6">
                <div className="mb-5 flex items-center gap-2">
                  <ShieldCheck className="text-accent-700" size={18} strokeWidth={2} />
                  <h3 className="font-display text-base font-bold text-slate-900">Por dentro: transacciones ACID</h3>
                </div>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                  {ACID.map((p, i) => (
                    <motion.div
                      key={p.letra}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-accent-600 font-display text-base font-bold text-accent-700">
                        {p.letra}
                      </div>
                      <p className="font-display text-sm font-bold text-slate-900">{p.nombre}</p>
                      <p className="text-sm leading-relaxed text-slate-500">{p.detalle}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="mt-5 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-500">
                  Además, cada venta es una operación simple: un <span className="font-mono text-xs">INSERT</span>{" "}
                  sobre una tabla indexada por ID, sin JOINs ni cálculos de por medio. Esa simplicidad es la que
                  permite miles de transacciones por segundo.
                </p>
              </Panel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
