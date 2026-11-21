"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { STORY, frameSrc } from "@/lib/content";
import { Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";
import ScrubText from "@/components/ui/ScrubText";

export default function Story() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const reveal = useTransform(scrollYProgress, [0, 0.35], ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]);

  return (
    <section id="story" className="relative z-10 px-6 py-28 md:px-14 md:py-44">
      <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-12 md:gap-12">
        {/* Sticky headline */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <FadeUp>
              <Eyebrow>{STORY.eyebrow}</Eyebrow>
            </FadeUp>
            <WordReveal
              text={STORY.title}
              emphasis={["Family,", "Flavors"]}
              emphasisClassName="italic text-gold-deep"
              className="mt-6 font-display text-[clamp(2.8rem,6vw,5.6rem)] font-light leading-[0.95] tracking-tight text-ink"
            />
            <FadeUp delay={0.2} className="mt-10 hidden md:block">
              <p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/60">
                <span className="block h-px w-12 bg-gold-deep" />
                Since {1986}
              </p>
            </FadeUp>
          </div>
        </div>

        {/* Copy + image */}
        <div className="flex flex-col gap-14 md:col-span-7 md:pl-8">
          <FadeUp>
            <h3 className="font-display text-3xl font-light italic text-gold-deep md:text-4xl">{STORY.kicker}</h3>
          </FadeUp>

          <div className="flex flex-col gap-8 text-ink">
            {STORY.paragraphs.map((p, i) => (
              <ScrubText
                key={i}
                text={p}
                className={i === 0 ? "font-display text-[26px] font-normal leading-[1.35] tracking-tight md:text-[34px]" : "text-[17px] leading-[1.85] md:text-lg"}
              />
            ))}
          </div>

          <FadeUp>
            <ul className="flex flex-wrap gap-3" aria-label="Signature dishes">
              {STORY.signatureDishes.map((dish) => (
                <li key={dish} className="border border-ink/15 px-5 py-2.5 font-display text-xl italic text-ink/85">
                  {dish}
                </li>
              ))}
            </ul>
          </FadeUp>

          <div ref={imageRef} className="relative">
            <motion.div style={{ clipPath: reveal }} className="relative aspect-[4/5] w-full overflow-hidden bg-navy md:aspect-[5/4]">
              <motion.div style={{ y, scale: 1.18 }} className="absolute inset-0">
                <Image
                  src={frameSrc(100)}
                  alt="A chef in whites plating a dish in the Rajat Caterers kitchen"
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover object-[38%_50%]"
                />
              </motion.div>
              <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-gold/30" />
            </motion.div>
            <p className="eyebrow mt-4 text-ink/60">[ In the kitchen ]</p>
          </div>

          <FadeUp>
            <p className="text-lg leading-relaxed text-ink/80">{STORY.today}</p>
          </FadeUp>
        </div>
      </div>

      {/* Anchor quote */}
      <div className="mx-auto mt-28 max-w-5xl text-center md:mt-44">
        <FadeUp>
          <blockquote>
            <p className="font-display text-[clamp(2.2rem,5.4vw,4.8rem)] font-light leading-[1.05] tracking-tight text-ink">
              “{STORY.quote}{" "}
              <em className="text-gold-deep">{STORY.quoteEmphasis}</em>”
            </p>
            <footer className="eyebrow mt-8 text-ink/60">[ Rajat Caterers · Since 1986 ]</footer>
          </blockquote>
        </FadeUp>
      </div>
    </section>
  );
}
