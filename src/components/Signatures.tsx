"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { SIGNATURES, type Signature } from "@/lib/content";
import { useEnquiry } from "@/components/EnquiryContext";
import { EASE, Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";
import DietMark from "@/components/ui/DietMark";

const pad = (n: number) => String(n).padStart(2, "0");

/** A slow-turning seal of set text behind the index numeral (decorative, CSS-driven). */
function Seal() {
  // textLength = the circle's circumference (2 * PI * 88), so the phrase closes on itself exactly.
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className="seal pointer-events-none absolute inset-0 size-full text-gold-deep/45">
      <defs>
        <path id="seal-circle" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
      </defs>
      <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="0.4" />
      <text className="fill-current font-sans text-[9px] font-semibold uppercase">
        <textPath href="#seal-circle" textLength="552" lengthAdjust="spacing">
          Rajat Caterers · House Signatures · Since 1986 ·
        </textPath>
      </text>
    </svg>
  );
}

function AddButton({ dish }: { dish: Signature }) {
  const { has, toggle } = useEnquiry();
  const picked = has(dish.id);
  return (
    <button
      type="button"
      aria-pressed={picked}
      aria-label={`${picked ? "Remove" : "Add"} ${dish.name} ${picked ? "from" : "to"} your enquiry`}
      onClick={() => toggle({ id: dish.id, name: dish.name })}
      className={`inline-flex min-h-11 items-center gap-2.5 rounded-full border px-5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.97] ${
        picked ? "border-gold-deep bg-gold-deep text-paper" : "border-ink/25 text-ink/80 hover:border-gold-deep hover:text-gold-deep"
      }`}
    >
      <span className="relative flex size-4 items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={picked ? "on" : "off"}
            initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="flex"
          >
            {picked ? <Check className="size-4" strokeWidth={2} /> : <Plus className="size-4" strokeWidth={1.75} />}
          </motion.span>
        </AnimatePresence>
      </span>
      {picked ? "In your enquiry" : "Add to enquiry"}
    </button>
  );
}

export default function Signatures() {
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const current = SIGNATURES[active];

  // The row crossing the middle band of the viewport becomes the "plate on the pass".
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = rowRefs.current.indexOf(entry.target as HTMLLIElement);
          if (i >= 0) setActive(i);
        });
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    rowRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="signatures" className="relative z-10 px-6 py-28 md:px-14 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeUp>
              <Eyebrow>House Signatures</Eyebrow>
            </FadeUp>
            <WordReveal
              text="The plates guests ask for by name."
              emphasis={["name."]}
              emphasisClassName="italic text-gold-deep"
              className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[0.98] tracking-tight"
            />
          </div>
          <FadeUp delay={0.15}>
            <p className="max-w-sm text-base leading-relaxed text-ink/75 md:text-right md:text-lg">
              Five signatures from our kitchen, North Indian to Continental. Add any of them to your enquiry.
            </p>
          </FadeUp>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:gap-12">
          {/* Sticky index (desktop) */}
          <div className="hidden md:col-span-4 md:block">
            <div className="sticky top-36">
              <div className="relative flex aspect-square w-full max-w-[19rem] items-center justify-center">
                <Seal />
                <div className="relative h-[clamp(6rem,9vw,8.5rem)] w-full overflow-hidden text-center">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={active}
                      aria-hidden="true"
                      initial={{ y: "60%", opacity: 0, filter: "blur(8px)" }}
                      animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: "-60%", opacity: 0, filter: "blur(8px)" }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="font-display text-[clamp(6rem,9vw,8.5rem)] font-light leading-none tracking-tight text-gold-deep lining-nums tabular-nums"
                    >
                      {pad(active + 1)}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-6 flex max-w-[19rem] flex-col items-center">
                <div className="flex items-center gap-3">
                  <DietMark veg={current.veg} />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={current.cuisine + active}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="eyebrow text-ink/70"
                    >
                      {current.cuisine}
                    </motion.span>
                  </AnimatePresence>
                  <span className="eyebrow text-ink/40">/ {pad(SIGNATURES.length)}</span>
                </div>
                {/* Progress ticks */}
                <div aria-hidden="true" className="mt-6 flex items-center gap-2">
                  {SIGNATURES.map((s, i) => (
                    <span
                      key={s.id}
                      className={`block h-px w-8 origin-left bg-gold-deep transition-[transform,opacity] duration-500 ease-out-expo ${
                        i === active ? "scale-x-100 opacity-100" : "scale-x-50 opacity-30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* The list */}
          <ol className="md:col-span-8">
            {SIGNATURES.map((dish, i) => {
              const on = i === active;
              return (
                <li
                  key={dish.id}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="relative border-t border-ink/15 py-10 last:border-b md:py-14"
                >
                  {/* Gold hairline draws across the active row */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -top-px hidden h-px origin-left bg-gold-deep transition-transform duration-700 ease-out-expo md:block ${on ? "scale-x-100" : "scale-x-0"}`}
                  />
                  <FadeUp y={18}>
                    <div className="flex items-center gap-3 md:hidden">
                      <span className="eyebrow text-gold-deep tabular-nums">{pad(i + 1)}</span>
                      <DietMark veg={dish.veg} />
                      <span className="eyebrow text-ink/65">{dish.cuisine}</span>
                    </div>
                    <h3
                      className={`mt-4 font-display text-[clamp(2.3rem,5vw,4.6rem)] font-light leading-[1] tracking-tight transition-colors duration-500 md:mt-0 ${
                        on ? "text-ink" : "text-ink md:text-ink/25"
                      }`}
                    >
                      {dish.name}
                    </h3>
                    <div
                      className={`mt-6 flex flex-col gap-6 transition-opacity duration-500 sm:flex-row sm:items-end sm:justify-between [&>button]:self-start sm:[&>button]:self-auto ${on ? "opacity-100" : "opacity-100 md:opacity-45"}`}
                    >
                      <p className="max-w-md text-base leading-relaxed text-ink/75 md:text-lg">{dish.desc}</p>
                      <AddButton dish={dish} />
                    </div>
                  </FadeUp>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
