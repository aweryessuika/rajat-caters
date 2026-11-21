"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { PROMISES } from "@/lib/content";
import { Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";

function StackCard({
  index,
  total,
  progress,
  title,
  body,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  title: string;
  body: string;
}) {
  // Each card settles slightly smaller as the next one layers on top of it.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.035]);

  return (
    <div className="sticky mb-8 md:mb-14" style={{ top: `calc(5.5rem + ${index * 1.1}rem)` }}>
      <motion.article
        style={{ scale, transformOrigin: "top center" }}
        className="stack-card relative grid gap-6 overflow-hidden border border-ink/15 bg-paper p-7 shadow-[0_24px_50px_-28px_rgba(10,21,48,0.45)] md:grid-cols-[minmax(0,9rem)_1fr_1fr] md:items-end md:gap-12 md:p-12"
      >
        <span aria-hidden="true" className="font-display text-[5.5rem] font-light leading-none text-gold-deep/25 md:text-[9rem]">
          0{index + 1}
        </span>
        <h3 className="font-display text-4xl font-normal leading-[1] tracking-tight md:text-6xl">{title}</h3>
        <p className="max-w-sm text-base leading-relaxed text-ink/75 md:pb-2 md:text-lg">{body}</p>
      </motion.article>
    </div>
  );
}

export default function OurPromise() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 85%"] });

  return (
    <section id="promise" className="relative z-10 border-y border-ink/10 bg-paper-2/60 px-6 py-28 md:px-14 md:py-40">
      <div className="mx-auto max-w-[1100px]">
        <FadeUp>
          <Eyebrow>Our Promise</Eyebrow>
        </FadeUp>
        <WordReveal
          text="Generous at the table, careful with everything else."
          emphasis={["careful"]}
          emphasisClassName="italic text-gold-deep"
          className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[0.98] tracking-tight"
        />
        <div ref={listRef} className="mt-14 md:mt-20">
          {PROMISES.map((p, i) => (
            <StackCard key={p.title} index={i} total={PROMISES.length} progress={scrollYProgress} title={p.title} body={p.body} />
          ))}
        </div>
      </div>
    </section>
  );
}
