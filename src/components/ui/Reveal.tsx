"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export const EASE = [0.23, 1, 0.32, 1] as const;

type FadeUpProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function FadeUp({ children, delay = 0, y = 24, className }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

type WordRevealProps = {
  text: string;
  as?: keyof typeof TAGS;
  className?: string;
  /** Words (exact match, punctuation-free) rendered with `emphasisClassName`. */
  emphasis?: readonly string[];
  emphasisClassName?: string;
  delay?: number;
  /** Animate on mount instead of on scroll (hero). */
  immediate?: boolean;
};

/**
 * Word-by-word masked reveal. The wrapper keeps the full sentence as its accessible
 * name; the split words are hidden from assistive tech.
 */
export function WordReveal({
  text,
  as = "h2",
  className,
  emphasis = [],
  emphasisClassName = "italic",
  delay = 0,
  immediate = false,
}: WordRevealProps) {
  const Tag = TAGS[as];
  const words = text.split(" ");

  const trigger = immediate
    ? { animate: "show" as const }
    : {
        whileInView: "show" as const,
        viewport: { once: true, margin: "0px 0px -15% 0px" },
      };

  return (
    <Tag
      aria-label={text}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
      className={className}
    >
      {words.map((word, i) => {
        const clean = word.replace(/[^A-Za-z0-9’']/g, "");
        const isEmphasis = emphasis.includes(clean);
        return (
          <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block will-change-transform ${isEmphasis ? emphasisClassName : ""}`}
              variants={{
                hidden: { y: "108%", rotate: 2 },
                show: { y: "0%", rotate: 0, transition: { duration: 1, ease: EASE } },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

type EyebrowProps = { children: ReactNode; tone?: "light" | "dark"; className?: string };

export function Eyebrow({ children, tone = "light", className = "" }: EyebrowProps) {
  const color = tone === "dark" ? "text-gold" : "text-gold-deep";
  return <span className={`eyebrow ${color} ${className}`}>[ {children} ]</span>;
}
