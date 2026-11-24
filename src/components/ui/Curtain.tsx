"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * The background of a dark section, drawn as a card that widens to full bleed as the
 * section rises into view, with its top corners rounding off as it settles. Only a
 * solid-colour layer is transformed (compositor-friendly); the content never moves.
 * Place as the first child of a `relative` section that has no background of its own.
 */
export default function CurtainBg({ className = "bg-navy" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.1"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [44, 0]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ scaleX, borderTopLeftRadius: radius, borderTopRightRadius: radius }}
      className={`curtain-bg pointer-events-none absolute inset-0 -z-10 origin-top ${className}`}
    />
  );
}
