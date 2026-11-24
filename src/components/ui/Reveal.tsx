"use client";

import { Fragment, type ReactNode } from "react";
import { motion } from "framer-motion";

export const EASE = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

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
  /** Draw a gold ink stroke under emphasised words once they land. */
  ink?: boolean;
};

/**
 * Word-by-word masked reveal. Each word rises through its own mask, tilting upright and
 * coming into focus (a short blur hides the crossover). Emphasised words then get a gold
 * stroke drawn under them. The wrapper keeps the full sentence as its accessible name.
 */
export function WordReveal({
  text,
  as = "h2",
  className,
  emphasis = [],
  emphasisClassName = "italic",
  delay = 0,
  immediate = false,
  ink = true,
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
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      className={className}
    >
      {words.map((word, i) => {
        const clean = word.replace(/[^A-Za-z0-9’']/g, "");
        const isEmphasis = emphasis.includes(clean);
        // The space lives BETWEEN the word boxes (not inside them): balanced wrapping trims
        // trailing spaces inside inline-blocks, which glued the words together.
        return (
          <Fragment key={`${word}-${i}`}>
          {i > 0 && " "}
          <span aria-hidden="true" className="relative inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
            <motion.span
              className={`reveal-word inline-block origin-bottom-left ${isEmphasis ? emphasisClassName : ""}`}
              variants={{
                hidden: { y: "110%", rotate: 4, filter: "blur(6px)" },
                show: { y: "0%", rotate: 0, filter: "blur(0px)", transition: { duration: 1.05, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
            {isEmphasis && ink && (
              <motion.span
                className="reveal-ink pointer-events-none absolute bottom-[0.06em] left-0 h-[0.045em] min-h-px w-[calc(100%-0.3em)] origin-left rounded-full bg-current opacity-70"
                variants={{
                  hidden: { scaleX: 0 },
                  show: { scaleX: 1, transition: { duration: 0.9, delay: 0.55, ease: EASE_IN_OUT } },
                }}
              />
            )}
          </span>
          </Fragment>
        );
      })}
    </Tag>
  );
}

type EyebrowProps = { children: ReactNode; tone?: "light" | "dark"; className?: string };

/** Section label. Its brackets part from the centre as the label opens into view. */
export function Eyebrow({ children, tone = "light", className = "" }: EyebrowProps) {
  const color = tone === "dark" ? "text-gold" : "text-gold-deep";
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      className={`eyebrow inline-flex items-center gap-[0.6em] ${color} ${className}`}
    >
      <motion.span
        aria-hidden="true"
        className="eyebrow-part inline-block"
        variants={{ hidden: { x: "0.9em", opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.8, ease: EASE } } }}
      >
        [
      </motion.span>
      <motion.span
        className="eyebrow-part inline-block"
        variants={{
          hidden: { clipPath: "inset(0% 50% 0% 50%)" },
          show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.9, delay: 0.08, ease: EASE_IN_OUT } },
        }}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="eyebrow-part inline-block"
        variants={{ hidden: { x: "-0.9em", opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.8, ease: EASE } } }}
      >
        ]
      </motion.span>
    </motion.span>
  );
}
