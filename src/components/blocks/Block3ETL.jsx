import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Wand2, UploadCloud, Boxes, ArrowRight, CircleCheck, Copy, BookOpen } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { ETL_DIRTY, ETL_CLEAN, PRODUCTOS, SUCURSALES } from "../../data/mockData";
import Button from "../ui/Button";
import Panel from "../ui/Panel";
import DataTable from "../ui/DataTable";
import Badge from "../ui/Badge";
import SectionHeader from "../ui/SectionHeader";
import ConceptIntro from "../ui/ConceptIntro";

const STEPS = [
  { key: "extract", label: "Extraer", icon: Download },
  { key: "transform", label: "Transformar", icon: Wand2 },
  { key: "load", label: "Cargar", icon: UploadCloud },
];

const nombreProducto = (id) => PRODUCTOS.find((p) => p.id === id)?.nombre ?? id;
const nombreSucursal = (id) => SUCURSALES.find((s) => s.id === id)?.nombre ?? id;

function Stepper({ etlStep, setEtlStep }) {
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((s, i) => {
        const idx = STEPS.findIndex((x) => x.key === etlStep);
        const status = i < idx ? "done" : i === idx ? "active" : "pending";
        const Icon = s.icon;
        return (
          <div key={s.key} className="flex items-center gap-3">
            {i > 0 && <div className="h-px w-8 bg-slate-200" />}
            <button
              onClick={() => setEtlStep(s.key)}
              className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                status === "active"
                  ? "border-accent-600 bg-accent-50 text-accent-700"
                  : status === "done"
                    ? "border-slate-300 bg-slate-100 text-slate-600"
                    : "border-slate-200 bg-white text-slate-400"
              }`}
            >
              <Icon size={13} strokeWidth={2} />
              {i + 1}. {s.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function SweepOverlay({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="sweep"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        >
          <div className="animate-sweep absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-accent-300/50 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Block3ETL() {
  const [phase, setPhase] = useState("concept");
  const etlStep = useAppStore((s) => s.etlStep);
  const setEtlStep = useAppStore((s) => s.setEtlStep);
  const next = useAppStore((s) => s.next);
  const [transformed, setTransformed] = useState(false);
  const [sweeping, setSweeping] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleTransformToggle = () => {
    setSweeping(true);
    setTransformed((v) => !v);
    setTimeout(() => setSweeping(false), 750);
  };

  const dirtyColumns = [
    { key: "fecha", label: "Fecha" },
    { key: "sucursal", label: "Sucursal" },
    { key: "producto", label: "Producto" },
    { key: "monto", label: "Monto" },
    { key: "cantidad", label: "Cant." },
  ];
  const cleanColumns = [
    { key: "fecha", label: "Fecha (ISO)" },
    { key: "sucursal", label: "Sucursal" },
    { key: "producto", label: "Producto" },
    { key: "monto", label: "Monto (USD)" },
    { key: "cantidad", label: "Cant." },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Bloque 2 del pipeline · Estandarización"
        title="ETL — Extract, Transform, Load"
        subtitle="Antes de vivir en el Data Warehouse, los datos deben hablar el mismo idioma: mismas fechas, misma moneda, sin duplicados."
      />

      <AnimatePresence mode="wait">
        {phase === "concept" ? (
          <ConceptIntro
            key="concept"
            definition="ETL (Extract, Transform, Load) es el proceso que extrae datos de múltiples fuentes operacionales, los transforma para que sean consistentes y confiables, y los carga en un repositorio analítico. Es el puente entre la operación diaria y el análisis estratégico."
            application="Las sucursales de Multimarket registran fechas, monedas y nombres de forma distinta. Antes de poder compararlas, el proceso ETL estandariza cada campo, elimina duplicados y deja los datos listos para vivir en el Data Warehouse."
            ctaLabel="Comenzar práctica: estandarizar el lote"
            onStart={() => setPhase("practice")}
          />
        ) : (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setPhase("concept")}
                className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400 transition-colors hover:text-accent-700"
              >
                <BookOpen size={12} strokeWidth={2} />
                Volver a la definición
              </button>
              <Stepper etlStep={etlStep} setEtlStep={setEtlStep} />
            </div>

            <AnimatePresence mode="wait">
              {etlStep === "extract" && (
                <motion.div
                  key="extract"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2">
                    <Badge tone="dirty">Datos crudos</Badge>
                    <span className="text-sm text-slate-500">
                      Formatos de fecha mixtos, monedas distintas y un registro duplicado.
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-orange-300 bg-orange-50/30 p-1">
                    <DataTable columns={dirtyColumns}>
                      {ETL_DIRTY.map((row) => (
                        <tr key={row.id}>
                          <td className="px-4 py-2.5 font-mono text-xs text-orange-700">{row.fecha}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-700">{row.sucursal}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-700">{row.producto}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-orange-700">{row.monto}</td>
                          <td className="px-4 py-2.5 font-mono text-sm text-slate-700">
                            <div className="flex items-center gap-1.5">
                              {row.cantidad}
                              {row.id === "a2" && (
                                <span title="Duplicado">
                                  <Copy size={12} className="text-signal-warn" />
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </DataTable>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary" icon={ArrowRight} onClick={() => setEtlStep("transform")}>
                      Transformar
                    </Button>
                  </div>
                </motion.div>
              )}

              {etlStep === "transform" && (
                <motion.div
                  key="transform"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge tone={transformed ? "clean" : "dirty"}>
                        {transformed ? "Datos limpios" : "Datos crudos"}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        {transformed
                          ? "Fechas en ISO-8601, montos unificados en USD, duplicado eliminado."
                          : "Ejecuta la transformación para estandarizar el lote."}
                      </span>
                    </div>
                    <Button variant="secondary" icon={Wand2} onClick={handleTransformToggle}>
                      {transformed ? "Deshacer" : "Ejecutar transformación"}
                    </Button>
                  </div>

                  <div
                    className={`relative overflow-hidden ${
                      transformed
                        ? "border border-emerald-200 bg-emerald-50/20 p-1"
                        : "border-2 border-dashed border-orange-300 bg-orange-50/30 p-1"
                    }`}
                  >
                    <SweepOverlay active={sweeping} />
                    <AnimatePresence mode="wait">
                      {!transformed ? (
                        <motion.div
                          key="dirty-table"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.35 }}
                        >
                          <DataTable columns={dirtyColumns}>
                            {ETL_DIRTY.map((row) => (
                              <tr key={row.id}>
                                <td className="px-4 py-2.5 font-mono text-xs text-orange-700">{row.fecha}</td>
                                <td className="px-4 py-2.5 text-sm text-slate-700">{row.sucursal}</td>
                                <td className="px-4 py-2.5 text-sm text-slate-700">{row.producto}</td>
                                <td className="px-4 py-2.5 font-mono text-xs text-orange-700">{row.monto}</td>
                                <td className="px-4 py-2.5 font-mono text-sm text-slate-700">{row.cantidad}</td>
                              </tr>
                            ))}
                          </DataTable>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="clean-table"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <DataTable columns={cleanColumns}>
                            {ETL_CLEAN.map((row, i) => (
                              <motion.tr
                                key={row.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                              >
                                <td className="px-4 py-2.5 font-mono text-xs text-emerald-700">{row.fecha}</td>
                                <td className="px-4 py-2.5 text-sm text-slate-700">{nombreSucursal(row.sucursal)}</td>
                                <td className="px-4 py-2.5 text-sm text-slate-700">{nombreProducto(row.producto)}</td>
                                <td className="px-4 py-2.5 font-mono text-xs text-emerald-700">
                                  ${row.monto.toFixed(2)}
                                </td>
                                <td className="px-4 py-2.5 font-mono text-sm text-slate-700">{row.cantidad}</td>
                              </motion.tr>
                            ))}
                          </DataTable>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" icon={ArrowRight} disabled={!transformed} onClick={() => setEtlStep("load")}>
                      Cargar
                    </Button>
                  </div>
                </motion.div>
              )}

              {etlStep === "load" && (
                <motion.div
                  key="load"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="flex flex-col items-center gap-8 py-6"
                >
                  <AnimatePresence mode="wait">
                    {!loaded ? (
                      <motion.div
                        key="pre-load"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 140, scale: 0.25 }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                        className="w-full max-w-lg"
                      >
                        <Panel accent="signal-clean" className="p-1">
                          <DataTable columns={cleanColumns} dense maxHeight="12rem">
                            {ETL_CLEAN.map((row) => (
                              <tr key={row.id}>
                                <td className="px-3 py-2 font-mono text-xs text-emerald-700">{row.fecha}</td>
                                <td className="px-3 py-2 text-xs text-slate-700">{nombreSucursal(row.sucursal)}</td>
                                <td className="px-3 py-2 text-xs text-slate-700">{nombreProducto(row.producto)}</td>
                                <td className="px-3 py-2 font-mono text-xs text-emerald-700">
                                  ${row.monto.toFixed(2)}
                                </td>
                                <td className="px-3 py-2 font-mono text-xs text-slate-700">{row.cantidad}</td>
                              </tr>
                            ))}
                          </DataTable>
                        </Panel>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="post-load"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
                        className="flex flex-col items-center gap-3 text-center"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <CircleCheck size={30} strokeWidth={1.5} />
                        </div>
                        <p className="font-display text-lg font-bold text-slate-900">
                          {ETL_CLEAN.length} registros cargados en el Data Warehouse
                        </p>
                        <p className="max-w-sm text-sm text-slate-500">
                          Los datos ya están disponibles en el modelo dimensional, listos para ser analizados.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={loaded ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-accent-700 bg-accent-800 text-white shadow-sm">
                      <Boxes size={30} strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                      Data Warehouse
                    </span>
                  </motion.div>

                  {!loaded ? (
                    <Button variant="primary" icon={UploadCloud} onClick={() => setLoaded(true)}>
                      Cargar en el Data Warehouse
                    </Button>
                  ) : (
                    <Button variant="primary" icon={ArrowRight} onClick={next}>
                      Continuar al Data Warehouse
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
