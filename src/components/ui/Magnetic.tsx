"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

/** Pulls its child a few pixels toward the mouse. Mouse-only; off for reduced motion. */
export default function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || reduced || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
