"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

/**
 * Soft light that follows the pointer inside a dark section (its parent must be
 * `relative`). Pointer-only: touch and reduced-motion get a static glow.
 */
export default function Spotlight({ strength = 0.1 }: { strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(72);
  const y = useMotionValue(18);
  const sx = useSpring(x, { stiffness: 55, damping: 18 });
  const sy = useSpring(y, { stiffness: 55, damping: 18 });
  const background = useMotionTemplate`radial-gradient(560px circle at ${sx}% ${sy}%, rgba(201,162,75,${strength}), transparent 62%)`;

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const move = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      x.set(((e.clientX - r.left) / r.width) * 100);
      y.set(((e.clientY - r.top) / r.height) * 100);
    };
    parent.addEventListener("pointermove", move);
    return () => parent.removeEventListener("pointermove", move);
  }, [x, y]);

  return <motion.div ref={ref} aria-hidden="true" style={{ background }} className="pointer-events-none absolute inset-0" />;
}
