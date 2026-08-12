import { motion } from "framer-motion";

export default function SectionHeader({ kicker, title, subtitle, align = "left" }) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {kicker && (
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent-600"
        >
          {kicker}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl text-base leading-relaxed text-slate-600"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
