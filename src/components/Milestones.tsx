"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { MILESTONES, STATS, TRUSTED_BY } from "@/lib/content";
import { Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";
import Spotlight from "@/components/ui/Spotlight";
import Footprint from "@/components/Footprint";

import CurtainBg from "@/components/ui/Curtain";
function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: to > 1000 ? 2.4 : 1.6,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} aria-label={`${to.toLocaleString("en-IN")}${suffix}`}>
      <span aria-hidden="true">
        {value.toLocaleString("en-IN")}
        {suffix}
      </span>
    </span>
  );
}

export default function Milestones() {
  return (
    <section id="milestones" data-dark className="relative z-10 overflow-hidden px-6 py-28 text-paper md:px-14 md:py-40">
      <CurtainBg />
      <Spotlight />
      <div className="relative mx-auto max-w-[1400px]">
        <FadeUp>
          <Eyebrow tone="dark">Milestones That Define Us</Eyebrow>
        </FadeUp>
        <WordReveal
          text="Four decades, counted in celebrations."
          emphasis={["celebrations."]}
          emphasisClassName="italic text-gold-soft"
          className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[0.98] tracking-tight"
        />

        <dl className="mt-20 grid grid-cols-1 gap-x-6 gap-y-14 min-[560px]:grid-cols-2 md:mt-28 lg:grid-cols-4 lg:gap-x-10">
          {STATS.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.08} className="border-t border-gold/30 pt-6">
              <dd className="font-display text-[clamp(3.4rem,7vw,6.4rem)] font-light leading-none text-gold-soft">
                <CountUp to={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-4 max-w-[16rem] text-sm font-medium leading-snug text-paper/90 md:text-base">{s.label}</dt>
              <p className="eyebrow mt-3 text-gold/90">{s.note}</p>
            </FadeUp>
          ))}
        </dl>

        <div className="mt-28 md:mt-36">
          <FadeUp>
            <p className="eyebrow text-gold">[ Where the kitchen has travelled ]</p>
            <p className="mt-4 max-w-xl text-base text-paper/75 md:text-lg">With the Airtel and Hitachi groups, from our Delhi kitchen to four countries abroad.</p>
          </FadeUp>
          <div className="mt-12 md:mt-16">
            <Footprint />
          </div>
        </div>

        <ol className="mt-28 border-t border-white/10 md:mt-36">
          {MILESTONES.map((m, i) => (
            <FadeUp key={m} delay={i * 0.04}>
              <li className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-white/10 py-6 transition-colors duration-300 hover:bg-white/[0.03] md:grid-cols-[6rem_1fr] md:py-8">
                <span className="eyebrow text-gold">0{i + 1}</span>
                <p className="font-display text-2xl font-light leading-snug text-paper/95 transition-transform duration-500 ease-out-expo md:text-4xl md:group-hover:translate-x-2">
                  {m}
                </p>
              </li>
            </FadeUp>
          ))}
        </ol>

        <FadeUp className="mt-20">
          <p className="eyebrow text-gold">[ Trusted by ]</p>
          <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4 font-display text-3xl font-light italic text-paper/90 md:text-5xl">
            {TRUSTED_BY.map((name, i) => (
              <li key={name} className="flex items-center gap-10">
                {name}
                {i < TRUSTED_BY.length - 1 && <span aria-hidden="true" className="hidden size-1.5 rotate-45 bg-gold md:block" />}
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}
