import { create } from "zustand";
import { OLTP_SEED } from "../data/mockData";

const TOTAL_SECONDS = 20 * 60;
export const TOTAL_STEPS = 9;

let nextTxId = OLTP_SEED.length + 1;

export const useAppStore = create((set, get) => ({
  // -------------------------------------------------------------------
  // Pipeline navigation
  // step 1: Portada, 2: Cronograma, 3: Tema, 4: Caso (Intro), 5: OLTP,
  // 6: ETL, 7: DW, 8: OLAP, 9: Cierre
  // -------------------------------------------------------------------
  step: 1,
  goToStep: (step) => set({ step }),
  next: () => set((s) => ({ step: Math.min(TOTAL_STEPS, s.step + 1) })),
  prev: () => set((s) => ({ step: Math.max(1, s.step - 1) })),

  // -------------------------------------------------------------------
  // Timer — 20 minute countdown, starts when the demo begins
  // -------------------------------------------------------------------
  secondsLeft: TOTAL_SECONDS,
  timerRunning: false,
  startTimer: () => set({ timerRunning: true }),
  tick: () =>
    set((s) => ({ secondsLeft: s.timerRunning ? Math.max(0, s.secondsLeft - 1) : s.secondsLeft })),

  // -------------------------------------------------------------------
  // Block 2 — OLTP transactions
  // -------------------------------------------------------------------
  transactions: OLTP_SEED,
  lastAddedId: null,
  addTransaction: ({ producto, sucursal, cantidad }) => {
    const id = nextTxId++;
    const tx = { id, timestamp: new Date().toISOString(), producto, sucursal, cantidad };
    set((s) => ({ transactions: [tx, ...s.transactions], lastAddedId: id }));
    setTimeout(() => {
      if (get().lastAddedId === id) set({ lastAddedId: null });
    }, 2000);
  },

  // -------------------------------------------------------------------
  // Block 3 — ETL pipeline sub-step
  // -------------------------------------------------------------------
  etlStep: "extract", // extract | transform | load
  setEtlStep: (etlStep) => set({ etlStep }),

  // -------------------------------------------------------------------
  // Block 4 — Data Warehouse star schema
  // -------------------------------------------------------------------
  expandedNode: null,
  toggleExpandedNode: (id) =>
    set((s) => ({ expandedNode: s.expandedNode === id ? null : id })),

  // -------------------------------------------------------------------
  // Block 5 — OLAP filters
  // -------------------------------------------------------------------
  olapFilters: { region: "Norte", producto: "Todos", trimestre: "T4 2025" },
  setOlapFilter: (key, value) =>
    set((s) => ({ olapFilters: { ...s.olapFilters, [key]: value } })),
  drillDown: false,
  toggleDrillDown: () => set((s) => ({ drillDown: !s.drillDown })),
}));
