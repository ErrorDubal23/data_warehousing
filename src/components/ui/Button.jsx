import { motion } from "framer-motion";

// Button bg/border/resting-text per variant. The icon rides inside a chip
// that sweeps out to fill the button on hover — label stays legible on top
// (z-10) the whole time, it just changes ink color as the chip sweeps under it.
const VARIANTS = {
  primary: "border border-accent-700 bg-accent-700 text-white",
  secondary: "border border-slate-300 bg-white text-slate-700",
  ghost: "border border-transparent bg-transparent text-slate-500",
};

const CHIP_VARIANTS = {
  primary: "bg-accent-400",
  secondary: "bg-accent-600",
  ghost: "bg-slate-700",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  iconPosition = "right",
  disabled = false,
  type = "button",
  className = "",
}) {
  const isLeft = iconPosition === "left";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`group relative inline-flex h-11 items-center overflow-hidden rounded-lg text-sm font-semibold tracking-tight transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${
        Icon ? (isLeft ? "pl-11 pr-5" : "pl-5 pr-11") : "px-5"
      } ${className}`}
    >
      {Icon && (
        <span
          className={`pointer-events-none absolute top-1 bottom-1 z-0 flex w-9 items-center rounded-md transition-all duration-500 ease-out group-hover:w-[calc(100%-8px)] ${CHIP_VARIANTS[variant]} ${
            isLeft ? "left-1 justify-start pl-2.5" : "right-1 justify-end pr-2.5"
          }`}
        >
          <Icon size={16} strokeWidth={2} className="text-white" />
        </span>
      )}
      <span
        className={`relative z-10 transition-colors duration-300 ${
          variant === "primary" ? "" : "group-hover:text-white"
        }`}
      >
        {children}
      </span>
    </motion.button>
  );
}
