"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.82;
  const opacity = useTransform(progress, [start, Math.min(1, start + 0.18)], [0.16, 1]);
  // Under prefers-reduced-motion the `.scrub-word` rule in globals.css forces full opacity.
  return (
    <motion.span className="scrub-word" style={{ opacity }}>
      {word}
      {index < total - 1 ? " " : ""}
    </motion.span>
  );
}

/**
 * Paragraph whose words brighten as it scrolls through the reading zone.
 * A full-text copy stays in the DOM for assistive tech; the split words are hidden from it.
 */
export default function ScrubText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 86%", "end 50%"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={`${w}-${i}`} word={w} index={i} total={words.length} progress={scrollYProgress} />
        ))}
      </span>
    </p>
  );
}
