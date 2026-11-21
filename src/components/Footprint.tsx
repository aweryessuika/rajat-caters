"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { FOOTPRINT } from "@/lib/content";

function Dot({ at, progress }: { at: number; progress: MotionValue<number> }) {
  const fill = useTransform(progress, [Math.max(0, at - 0.1), at], [0, 1]);
  return (
    <span className="relative block size-3.5 rounded-full border border-gold/70 bg-navy">
      <motion.span style={{ opacity: at === 0 ? 1 : fill, scale: at === 0 ? 1 : fill }} className="absolute inset-[2px] rounded-full bg-gold" />
    </span>
  );
}

function Label({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const stop = FOOTPRINT[index];
  const at = index / (FOOTPRINT.length - 1);
  const opacity = useTransform(progress, [Math.max(0, at - 0.12), at], [0.35, 1]);
  return (
    <motion.span style={{ opacity: at === 0 ? 1 : opacity }} className="block">
      <span className="block font-display text-3xl font-light text-paper md:text-4xl">{stop.label}</span>
      <span className="eyebrow mt-1 block text-gold/90">{stop.note}</span>
    </motion.span>
  );
}

/** Route line that draws itself as the section scrolls into the reading zone. */
export default function Footprint() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 82%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const last = FOOTPRINT.length - 1;

  return (
    <div ref={ref}>
      {/* Wide screens: horizontal route */}
      <div className="relative hidden h-28 md:block" aria-hidden="true">
        <div className="absolute inset-x-0 top-[7px] h-px bg-white/15" />
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 top-[7px] h-px origin-left bg-gold" />
        {FOOTPRINT.map((stop, i) => {
          const pct = (i / last) * 100;
          return (
            <div key={stop.label} className="absolute top-0" style={{ left: `${pct}%`, transform: `translateX(-${pct}%)` }}>
              <div className={i === last ? "flex justify-end" : ""}>
                <Dot at={i / last} progress={progress} />
              </div>
              <div className={`mt-5 ${i === last ? "text-right" : ""}`}>
                <Label index={i} progress={progress} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Small screens: vertical route */}
      <ol className="relative flex flex-col gap-9 pl-9 md:hidden" aria-hidden="true">
        <span className="absolute bottom-2 left-[6px] top-2 w-px bg-white/15" />
        <motion.span style={{ scaleY: progress }} className="absolute bottom-2 left-[6px] top-2 w-px origin-top bg-gold" />
        {FOOTPRINT.map((stop, i) => (
          <li key={stop.label} className="relative">
            <span className="absolute -left-9 top-2">
              <Dot at={i / last} progress={progress} />
            </span>
            <Label index={i} progress={progress} />
          </li>
        ))}
      </ol>

      <p className="sr-only">
        Rajat Caterers has catered in {FOOTPRINT.map((s) => s.label).join(", ")}.
      </p>
    </div>
  );
}
