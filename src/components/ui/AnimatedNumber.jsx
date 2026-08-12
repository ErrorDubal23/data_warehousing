import { useEffect, useRef, useState } from "react";

// Tweens numeric text content between values — used anywhere a figure
// updates live (filters, counters) so the change reads as motion, not a jump cut.
export default function AnimatedNumber({ value, formatter = (v) => Math.round(v).toString(), duration = 600 }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);
  const rafRef = useRef();

  useEffect(() => {
    const from = prevValue.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevValue.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return formatter(display);
}
