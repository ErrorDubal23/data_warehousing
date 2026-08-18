import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Store, Calendar, Users, Database, X, KeyRound, Link2, Hash, BookOpen } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { FACT_TABLE, DIMENSIONS } from "../../data/mockData";
import SectionHeader from "../ui/SectionHeader";
import Badge from "../ui/Badge";
import ConceptIntro from "../ui/ConceptIntro";
import AnimatedNumber from "../ui/AnimatedNumber";

const ICONS = { package: Package, store: Store, calendar: Calendar, users: Users };

const POSITIONS = {
  top: { top: "0%", left: "50%", translate: "-50%, 0%" },
  right: { top: "50%", left: "100%", translate: "-100%, -50%" },
  bottom: { top: "100%", left: "50%", translate: "-50%, -100%" },
  left: { top: "50%", left: "0%", translate: "0%, -50%" },
};

const LINE_ENDS = {
  top: { x2: 50, y2: 6 },
  right: { x2: 94, y2: 50 },
  bottom: { x2: 50, y2: 94 },
  left: { x2: 6, y2: 50 },
};

function typeBadgeTone(type) {
  if (type === "PK") return "key";
  if (type === "FK") return "accent";
  if (type === "MÉTRICA") return "clean";
  return "neutral";
}

function typeIcon(type) {
  if (type === "PK") return KeyRound;
  if (type === "FK") return Link2;
  return Hash;
}

function SchemaPanel({ node, onClose }) {
  const isFact = node.id === "fact";
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3 }}
      className="border border-slate-200 bg-white shadow-sm"
      style={{ borderLeftWidth: "3px", borderLeftColor: isFact ? "var(--color-accent-800)" : "var(--color-accent-600)" }}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
            {isFact ? "Tabla de hechos" : "Dimensión"}
          </p>
          <p className="font-display text-base font-bold text-slate-900">{node.name}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 transition-colors hover:text-slate-700">
          <X size={18} />
        </button>
      </div>
      <ul className="divide-y divide-slate-100">
        {node.columns.map((col, i) => {
          const Icon = typeIcon(col.type);
          return (
            <motion.li
              key={col.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between gap-3 px-5 py-2.5"
            >
              <div className="flex items-center gap-2">
                <Icon size={13} className="text-slate-400" strokeWidth={2} />
                <span className="font-mono text-sm text-slate-700">{col.name}</span>
              </div>
              <Badge tone={typeBadgeTone(col.type)}>{col.type}</Badge>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export default function Block4DataWarehouse() {
  const [phase, setPhase] = useState("concept");
  const expandedNode = useAppStore((s) => s.expandedNode);
  const toggleExpandedNode = useAppStore((s) => s.toggleExpandedNode);
  const warehouse = useAppStore((s) => s.warehouse);

  const activeNode =
    expandedNode === "fact" ? FACT_TABLE : DIMENSIONS.find((d) => d.id === expandedNode) ?? null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Bloque 3 del pipeline · Modelado"
        title="Data Warehouse — Esquema Estrella"
        subtitle="Una tabla de hechos en el centro, rodeada de dimensiones que le dan contexto. Este es el modelo de Kimball en acción."
      />

      <AnimatePresence mode="wait">
        {phase === "concept" ? (
          <ConceptIntro
            key="concept"
            definition="Un Data Warehouse es un repositorio central diseñado para el análisis, no para la operación. Su modelo dimensional —el esquema estrella— organiza los datos en una tabla de hechos con las métricas del negocio, rodeada de dimensiones que aportan contexto: quién, qué, dónde y cuándo."
            application="En Multimarket, cada venta ya limpia se convierte en un hecho conectado a cuatro dimensiones: Producto, Tienda, Tiempo y Cliente. Esta estructura permite cruzar cualquier combinación de esos ejes sin rediseñar nada."
            ventajas={[
              "Una sola fuente de verdad consolidada — se acabaron los cruces manuales de Excel.",
              "El modelo dimensional está optimizado para lectura y agregación masiva.",
              "Conserva el historial completo, algo que un sistema OLTP normalmente no guarda.",
            ]}
            desventajas={[
              "Requiere inversión inicial de diseño (modelado dimensional) y de infraestructura.",
              "Los datos no son de tiempo real — dependen de con qué frecuencia corre el ETL.",
              "Desnormalizar implica duplicar datos, lo que consume más espacio de almacenamiento.",
            ]}
            ctaLabel="Comenzar práctica: explorar el esquema"
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
                className="flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400 transition-colors hover:text-accent-700"
              >
                <BookOpen size={12} strokeWidth={2} />
                Volver a la definición
              </button>
              {warehouse.length > 0 && (
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                  <AnimatedNumber value={warehouse.length} /> registros en el warehouse ahora mismo
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5">
              <div className="relative mx-auto aspect-square w-full max-w-md lg:col-span-3">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }}>
                  {DIMENSIONS.map((dim) => {
                    const end = LINE_ENDS[dim.position];
                    const active = expandedNode === dim.id || expandedNode === "fact";
                    return (
                      <line
                        key={dim.id}
                        x1={50}
                        y1={50}
                        x2={end.x2}
                        y2={end.y2}
                        stroke={active ? "var(--color-accent-500)" : "var(--color-slate-300)"}
                        strokeWidth={0.6}
                        strokeDasharray={active ? undefined : "2 3"}
                        className={active ? "animate-flow" : ""}
                      />
                    );
                  })}
                </svg>

                {/* Fact table — center node */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                  onClick={() => toggleExpandedNode("fact")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`absolute flex w-32 flex-col items-center gap-1.5 border px-3 py-3 text-center shadow-sm transition-colors ${
                    expandedNode === "fact"
                      ? "border-accent-800 bg-accent-800 text-white"
                      : "border-accent-700 bg-white text-accent-800 hover:bg-accent-50"
                  }`}
                  style={{ top: "50%", left: "50%", translate: "-50% -50%", zIndex: 2 }}
                >
                  <Database size={20} strokeWidth={1.75} />
                  <span className="font-mono text-[11px] font-semibold leading-tight">{FACT_TABLE.name}</span>
                </motion.button>

                {/* Dimension nodes */}
                {DIMENSIONS.map((dim, i) => {
                  const pos = POSITIONS[dim.position];
                  const Icon = ICONS[dim.icon];
                  const isActive = expandedNode === dim.id;
                  return (
                    <motion.button
                      key={dim.id}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 260, damping: 20 }}
                      onClick={() => toggleExpandedNode(dim.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className={`absolute flex w-28 flex-col items-center gap-1.5 border px-3 py-2.5 text-center shadow-sm transition-colors ${
                        isActive
                          ? "border-accent-600 bg-accent-600 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:border-accent-400"
                      }`}
                      style={{ top: pos.top, left: pos.left, translate: pos.translate, zIndex: 2 }}
                    >
                      <Icon size={17} strokeWidth={1.75} />
                      <span className="font-mono text-[11px] font-semibold leading-tight">{dim.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {activeNode ? (
                    <SchemaPanel
                      key={activeNode.id ?? activeNode.name}
                      node={activeNode}
                      onClose={() => toggleExpandedNode(expandedNode)}
                    />
                  ) : (
                    <motion.div
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border border-dashed border-slate-300 bg-slate-50 p-6 text-center"
                    >
                      <p className="text-sm text-slate-500">
                        Haz clic en la tabla de hechos o en cualquier dimensión para inspeccionar su esquema.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
