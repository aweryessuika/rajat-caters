"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SERVICES, frameSrc } from "@/lib/content";
import { Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";
import Cta from "@/components/ui/Cta";

export default function Services() {
  const [active, setActive] = useState(0);
  const current = SERVICES[active];

  return (
    <section id="services" className="relative z-10 px-6 py-28 md:px-14 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <FadeUp>
          <Eyebrow>Our Craft</Eyebrow>
        </FadeUp>
        <WordReveal
          text="Every kind of occasion, one kitchen."
          emphasis={["occasion,"]}
          emphasisClassName="italic text-gold-deep"
          className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[0.98] tracking-tight"
        />

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-16">
          {/* Accordion */}
          <ul className="md:col-span-7">
            {SERVICES.map((service, i) => {
              const open = active === i;
              return (
                <li key={service.id} className="border-t border-ink/15 last:border-b">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`service-${service.id}`}
                      onClick={() => setActive(i)}
                      onPointerMove={(e) => e.pointerType === "mouse" && active !== i && setActive(i)}
                      className="group flex w-full items-center gap-5 py-7 text-left md:gap-8 md:py-9"
                    >
                      <span className={`eyebrow w-8 shrink-0 transition-colors duration-300 ${open ? "text-gold-deep" : "text-ink/50"}`}>0{i + 1}</span>
                      <span
                        className={`flex-1 font-display text-[clamp(2rem,4.4vw,3.8rem)] font-light leading-none tracking-tight transition-[color,transform] duration-500 ease-out-expo ${
                          open ? "translate-x-2 italic text-ink" : "text-ink/55 group-hover:text-ink"
                        }`}
                      >
                        {service.title}
                      </span>
                      <Plus
                        aria-hidden="true"
                        className={`size-6 shrink-0 text-gold-deep transition-transform duration-500 ease-out-expo ${open ? "rotate-45" : ""}`}
                        strokeWidth={1.25}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`service-${service.id}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 pb-9 pl-[3.25rem] md:pl-[4.5rem]">
                          <p className="max-w-xl text-base leading-[1.8] text-ink/80 md:text-lg">{service.desc}</p>
                          <ul className="flex flex-wrap gap-2" aria-label={`${service.title} highlights`}>
                            {service.tags.map((tag) => (
                              <li key={tag} className="border border-gold-deep/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                                {tag}
                              </li>
                            ))}
                          </ul>
                          {/* Image shown inline on small screens */}
                          <div className="relative mt-2 aspect-[4/3] overflow-hidden bg-navy md:hidden">
                            <Image src={frameSrc(service.frame)} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: service.position }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Image panel (desktop) */}
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-navy shadow-[0_30px_60px_-30px_rgba(10,21,48,0.5)]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0"
                  >
                    <Image src={frameSrc(current.frame)} alt="" fill sizes="40vw" className="object-cover" style={{ objectPosition: current.position }} />
                  </motion.div>
                </AnimatePresence>
                <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-gold/30" />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/80 to-transparent" />
                <p className="eyebrow absolute bottom-5 left-5 text-gold-soft">[ 0{active + 1} / 0{SERVICES.length} ]</p>
              </div>
            </div>
          </div>
        </div>

        <FadeUp className="mt-16 flex flex-wrap items-center gap-6">
          <Cta href="#enquire" variant="outline-ink">
            Discuss your event
          </Cta>
          <p className="text-sm text-ink/70">Customised menus as per your requirement.</p>
        </FadeUp>
      </div>
    </section>
  );
}
