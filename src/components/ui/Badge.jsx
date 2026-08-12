const TONES = {
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  accent: "bg-accent-50 text-accent-700 border-accent-200",
  dirty: "bg-orange-50 text-orange-700 border-orange-200",
  clean: "bg-emerald-50 text-emerald-700 border-emerald-200",
  key: "bg-accent-800 text-white border-accent-800",
};

export default function Badge({ children, tone = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
