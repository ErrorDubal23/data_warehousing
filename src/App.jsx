import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore, TOTAL_STEPS } from "./store/useAppStore";
import Block0PipelineBar from "./components/blocks/Block0PipelineBar";
import BlockPortada from "./components/blocks/BlockPortada";
import BlockCronograma from "./components/blocks/BlockCronograma";
import BlockTemaIntro from "./components/blocks/BlockTemaIntro";
import Block1Intro from "./components/blocks/Block1Intro";
import Block2OLTP from "./components/blocks/Block2OLTP";
import Block3ETL from "./components/blocks/Block3ETL";
import Block4DataWarehouse from "./components/blocks/Block4DataWarehouse";
import Block5OLAP from "./components/blocks/Block5OLAP";
import Block6Closing from "./components/blocks/Block6Closing";
import BlockReferencias from "./components/blocks/BlockReferencias";
import AmbientBackground from "./components/ui/AmbientBackground";

// Multimarket (Block1Intro) sits at step 5, between OLTP and ETL — the
// audience has just seen one OLTP system capture one sale, so this is where
// that gets multiplied into a mess of siloed OLTP systems across branches,
// setting up exactly the problem ETL is about to solve.
const BLOCKS = {
  1: BlockPortada,
  2: BlockCronograma,
  3: BlockTemaIntro,
  4: Block2OLTP,
  5: Block1Intro,
  6: Block3ETL,
  7: Block4DataWarehouse,
  8: Block5OLAP,
  9: Block6Closing,
  10: BlockReferencias,
};

// Alternates white / slate-50 between steps to simulate processing "layers".
// Kept semi-transparent so the ambient network drifts through the whitespace.
const BG_BY_STEP = {
  1: "bg-slate-50/60",
  2: "bg-white/60",
  3: "bg-slate-50/60",
  4: "bg-white/60",
  5: "bg-slate-50/60",
  6: "bg-white/60",
  7: "bg-slate-50/60",
  8: "bg-white/60",
  9: "bg-slate-50/60",
  10: "bg-white/60",
};

// Steps 1–3 (portada, cronograma, tema) each carry their own centered CTA
// that intentionally advances the story — the last one also starts the
// timer — so the free-roaming "next" arrow only appears once the interactive
// pipeline itself begins. "Back" has no such side effect, so it's available
// everywhere except the very first slide (which has nothing before it).
const NEXT_VISIBLE_FROM_STEP = 4;

function BottomNav() {
  const step = useAppStore((s) => s.step);
  const next = useAppStore((s) => s.next);
  const prev = useAppStore((s) => s.prev);

  if (step === 1) return null;

  const showNext = step >= NEXT_VISIBLE_FROM_STEP;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 border border-slate-200 bg-white/95 px-2 py-1.5 shadow-sm backdrop-blur">
      <button
        onClick={prev}
        className="flex h-8 w-8 items-center justify-center text-slate-500 transition-colors hover:text-accent-700 disabled:opacity-30"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="font-mono text-xs tabular-nums text-slate-400">
        {step} / {TOTAL_STEPS}
      </span>
      {showNext && (
        <button
          onClick={next}
          disabled={step === TOTAL_STEPS}
          className="flex h-8 w-8 items-center justify-center text-slate-500 transition-colors hover:text-accent-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

export default function App() {
  const step = useAppStore((s) => s.step);
  const ActiveBlock = BLOCKS[step];

  return (
    <div className="min-h-screen bg-white">
      <AmbientBackground />
      <Block0PipelineBar />
      <main
        className={`relative z-10 min-h-screen pt-16 transition-colors duration-500 lg:h-screen lg:overflow-hidden ${BG_BY_STEP[step]}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="lg:flex lg:h-full lg:flex-col lg:justify-center"
          >
            <ActiveBlock />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}
