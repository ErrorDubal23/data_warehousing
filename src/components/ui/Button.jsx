import { motion } from "framer-motion";

const VARIANTS = {
  primary:
    "bg-accent-700 text-white border border-accent-700 hover:bg-accent-800 hover:border-accent-800 shadow-sm",
  secondary:
    "bg-transparent text-slate-700 border border-slate-300 hover:border-accent-600 hover:text-accent-700",
  ghost:
    "bg-transparent text-slate-500 border border-transparent hover:text-slate-800 hover:bg-slate-100",
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
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.025, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-semibold tracking-tight transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
    >
      {Icon && iconPosition === "left" && <Icon size={16} strokeWidth={2} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={16} strokeWidth={2} />}
    </motion.button>
  );
}
