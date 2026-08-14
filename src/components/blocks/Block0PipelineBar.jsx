import { useEffect } from "react";
import { motion } from "framer-motion";
import { Database, Workflow, Boxes, BarChart3, Check, Timer } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import GithubIcon from "../ui/GithubIcon";

const REPO_URL = "https://github.com/ErrorDubal23/data_warehousing";

const STAGES = [
  { step: 5, key: "oltp", label: "OLTP", icon: Database },
  { step: 6, key: "etl", label: "ETL", icon: Workflow },
  { step: 7, key: "dw", label: "Data Warehouse", icon: Boxes },
  { step: 8, key: "olap", label: "OLAP", icon: BarChart3 },
];

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function stageStatus(currentStep, stageStep) {
  if (currentStep > stageStep) return "done";
  if (currentStep === stageStep) return "active";
  return "pending";
}

export default function Block0PipelineBar() {
  const step = useAppStore((s) => s.step);
  const secondsLeft = useAppStore((s) => s.secondsLeft);
  const timerRunning = useAppStore((s) => s.timerRunning);
  const tick = useAppStore((s) => s.tick);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, tick]);

  const warning = timerRunning && secondsLeft <= 120;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-6">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-fit items-center gap-2 text-slate-400 transition-colors duration-200 hover:text-accent-700"
          aria-label="Ver repositorio en GitHub"
        >
          <GithubIcon size={18} className="transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden font-mono text-[11px] uppercase tracking-wider sm:inline">GitHub</span>
        </a>

        <nav className="hidden items-center justify-center md:flex">
          <ol className="flex items-center">
            {STAGES.map((stage, i) => {
              const status = stageStatus(step, stage.step);
              const Icon = stage.icon;
              return (
                <li key={stage.key} className="flex items-center">
                  {i > 0 && (
                    <div className="relative mx-1.5 h-px w-10 bg-slate-200">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-accent-600"
                        initial={false}
                        animate={{ width: status !== "pending" ? "100%" : "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-7 w-7 items-center justify-center">
                      {status === "active" && (
                        <motion.span
                          className="absolute inset-0 rounded-full bg-accent-400/40"
                          animate={{ scale: [1, 1.7, 1.7], opacity: [0.5, 0, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                      <div
                        className={`relative flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-300 ${
                          status === "done"
                            ? "border-accent-600 bg-accent-600 text-white"
                            : status === "active"
                              ? "border-accent-600 bg-white text-accent-700 ring-4 ring-accent-100"
                              : "border-slate-300 bg-white text-slate-400"
                        }`}
                      >
                        {status === "done" ? (
                          <Check size={14} strokeWidth={2.5} />
                        ) : (
                          <Icon size={14} strokeWidth={2} />
                        )}
                      </div>
                    </div>
                    <span
                      className={`font-mono text-[11px] uppercase tracking-wider transition-colors duration-300 ${
                        status === "pending" ? "text-slate-400" : "text-slate-700"
                      } ${status === "active" ? "font-semibold text-accent-700" : ""}`}
                    >
                      {stage.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <motion.div
          animate={warning ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={warning ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
          className={`flex items-center justify-self-end gap-2 rounded-sm border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums transition-colors duration-300 ${
            warning
              ? "border-orange-300 bg-orange-50 text-orange-700"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          <Timer size={14} strokeWidth={2} />
          {formatTime(secondsLeft)}
        </motion.div>
      </div>
    </header>
  );
}
