"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CUISINES, SERVICE_REGIONS, SERVICE_STYLES, frameSrc } from "@/lib/content";
import { Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";

import CurtainBg from "@/components/ui/Curtain";
const CURTAIN = [0.77, 0, 0.175, 1] as const;

export default function ServingStyles() {
  return (
    <section id="styles" data-dark className="relative z-10 overflow-hidden px-6 py-28 text-paper md:px-14 md:py-40">
      <CurtainBg />
      <div className="mx-auto max-w-[1400px]">
        <FadeUp>
          <Eyebrow tone="dark">How We Serve</Eyebrow>
        </FadeUp>
        <WordReveal
          text="Three ways to set the table."
          emphasis={["table."]}
          emphasisClassName="italic text-gold-soft"
          className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[0.98] tracking-tight"
        />

        {/* The list is the observed element; the cards inside it are clipped, so they follow via variants. */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ staggerChildren: 0.12 }}
          className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3 md:gap-6"
        >
          {SERVICE_STYLES.map((style, i) => (
            <motion.li
              key={style.id}
              variants={{
                hidden: { clipPath: "inset(100% 0% 0% 0%)" },
                show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: CURTAIN } },
              }}
              className="style-card group relative aspect-[4/3] overflow-hidden bg-navy-2 md:aspect-[3/4]"
            >
              <motion.div
                variants={{
                  hidden: { scale: 1.18 },
                  show: { scale: 1, transition: { duration: 1.6, ease: [0.23, 1, 0.32, 1] } },
                }}
                className="absolute inset-0"
              >
                <Image
                  src={frameSrc(style.frame)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
                  style={{ objectPosition: style.position }}
                />
              </motion.div>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/5" />
              <div aria-hidden="true" className="absolute inset-3 border border-gold/25 transition-colors duration-500 group-hover:border-gold/60" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-8">
                <p className="eyebrow text-gold">0{i + 1}</p>
                <h3 className="mt-3 font-display text-[clamp(2rem,3vw,2.8rem)] font-light leading-none tracking-tight text-paper">{style.title}</h3>
                <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-paper/80">{style.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-16 grid gap-12 border-t border-white/15 pt-12 md:mt-20 md:grid-cols-2 md:gap-16">
          <FadeUp>
            <p className="eyebrow text-gold">[ Cuisines ]</p>
            <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              {CUISINES.map((c, i) => (
                <li key={c} className="flex items-center gap-5">
                  <span className="font-display text-3xl font-light italic text-gold-soft md:text-4xl">{c}</span>
                  {i < CUISINES.length - 1 && <span aria-hidden="true" className="block size-1.5 rotate-45 bg-gold" />}
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="eyebrow text-gold">[ Where we cater ]</p>
            <dl className="mt-5">
              {SERVICE_REGIONS.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-6 border-b border-white/10 py-3 last:border-b-0">
                  <dt className="font-display text-3xl font-light md:text-4xl">{r.label}</dt>
                  <dd className="text-right text-sm text-paper/70">{r.note}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
