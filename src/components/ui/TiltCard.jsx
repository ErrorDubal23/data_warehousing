import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// A "hazard label" card: tracks the cursor for a real 3D tilt (not a canned
// hover state), a diagonal caution-stripe texture, and a badge that floats
// above the surface via translateZ. Built for a handful of high-impact spots
// — not meant to replace Panel everywhere.
const STRIPE_RGB = {
  "signal-dirty": "180, 83, 9",
  "signal-warn": "234, 88, 12",
  "accent-600": "31, 71, 144",
};

export default function TiltCard({ children, accent = "signal-dirty", badge, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [9, -9]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), { stiffness: 220, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const stripe = STRIPE_RGB[accent] ?? STRIPE_RGB["signal-dirty"];
  const borderVar = `var(--color-${accent})`;

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", borderColor: borderVar }}
        className="relative h-full overflow-hidden border-2 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgb(${stripe}) 0 3px, transparent 3px 16px)`,
          }}
        />

        <motion.div style={{ transform: "translateZ(35px)" }} className="relative">
          {children}
        </motion.div>

        {badge && (
          <motion.div
            style={{ transform: "translateZ(65px)", borderColor: borderVar }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white shadow-md"
          >
            {badge}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
