"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MEALS, WEEKLY_MENU, WEEK_DAYS, type WeekDay } from "@/lib/content";
import { Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";
import Spotlight from "@/components/ui/Spotlight";

import CurtainBg from "@/components/ui/Curtain";
const subscribeNever = () => () => {};

/** Which meal is being served right now: 0 breakfast, 1 lunch, 2 dinner. Null on the server. */
const mealNow = () => {
  const h = new Date().getHours();
  return h < 11 ? 0 : h < 16 ? 1 : 2;
};

export default function WeeklyMenu() {
  // Today's weekday is read on the client only (null during server render).
  const today = useSyncExternalStore<WeekDay | null>(
    subscribeNever,
    () => WEEK_DAYS[new Date().getDay()],
    () => null,
  );
  const nowMeal = useSyncExternalStore<number | null>(subscribeNever, mealNow, () => null);
  const [chosen, setDay] = useState<WeekDay | null>(null);
  const day: WeekDay = chosen ?? today ?? "Sunday";

  return (
    <section id="weekly" data-dark className="relative z-10 overflow-hidden px-6 py-28 text-paper md:px-14 md:py-44">
      <CurtainBg />
      <Spotlight />
      <div className="relative mx-auto max-w-[1400px]">
        <FadeUp>
          <Eyebrow tone="dark">Daily Meal Service</Eyebrow>
        </FadeUp>
        <WordReveal
          text="A new menu every day of the week."
          emphasis={["every"]}
          emphasisClassName="italic text-gold-soft"
          className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[0.98] tracking-tight"
        />
        <FadeUp delay={0.15}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
            A sample weekly plan for offices, institutions and teams: breakfast, lunch and dinner, rotating through the week. Plans are customised to your requirement.
          </p>
        </FadeUp>

        <div role="tablist" aria-label="Day of the week" className="no-scrollbar -mx-6 mt-14 flex gap-1 overflow-x-auto px-6 md:mx-0 md:mt-20 md:gap-2 md:px-0">
          {WEEK_DAYS.map((d) => {
            const selected = d === day;
            return (
              <button
                key={d}
                role="tab"
                id={`day-${d}`}
                aria-selected={selected}
                aria-controls="weekly-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setDay(d)}
                onKeyDown={(e) => {
                  const i = WEEK_DAYS.indexOf(day);
                  if (e.key === "ArrowRight") setDay(WEEK_DAYS[(i + 1) % 7]);
                  if (e.key === "ArrowLeft") setDay(WEEK_DAYS[(i + 6) % 7]);
                }}
                className={`relative min-h-12 shrink-0 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-200 active:scale-[0.97] md:px-6 ${
                  selected ? "text-navy" : "text-paper/70 hover:text-paper"
                }`}
              >
                {selected && (
                  <motion.span layoutId="weekly-day-pill" className="absolute inset-0 bg-gold" transition={{ type: "spring", duration: 0.5, bounce: 0.12 }} />
                )}
                <span className="relative">
                  {d.slice(0, 3)}
                  {today === d && <span className="sr-only"> (today)</span>}
                </span>
                {today === d && !selected && <span aria-hidden="true" className="absolute right-2 top-2 size-1 rounded-full bg-gold" />}
              </button>
            );
          })}
        </div>
        <div className="h-px w-full bg-white/15" />

        <div role="tabpanel" id="weekly-panel" aria-labelledby={`day-${day}`} className="mt-10 md:mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              <h3 className="font-display text-5xl font-light italic text-gold-soft md:text-7xl">
                {day}
                {today === day && <span className="eyebrow ml-4 align-middle text-gold">[ Today ]</span>}
              </h3>
              <div className="mt-10 grid gap-px bg-white/10 md:mt-14 md:grid-cols-3">
                {MEALS.map((meal, mealIndex) => {
                  const serving = today === day && nowMeal === mealIndex;
                  return (
                  <div key={meal} className={`relative p-7 transition-colors duration-500 md:p-10 ${serving ? "bg-navy-2" : "bg-navy"}`}>
                    {serving && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gold" />}
                    <p className="eyebrow flex items-center gap-3 text-gold">
                      {meal}
                      {serving && (
                        <span className="flex items-center gap-2 text-gold-soft">
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
                          Now serving
                        </span>
                      )}
                    </p>
                    <ol className="mt-6 flex flex-col">
                      {WEEKLY_MENU[meal][day].map((item, i) => (
                        <li key={`${item.name}-${i}`} className="flex items-baseline gap-4 border-b border-white/10 py-3 last:border-b-0">
                          <span className="w-5 shrink-0 text-xs tabular-nums text-paper/65">{i + 1}</span>
                          <span className="flex-1 font-display text-2xl font-light leading-tight text-paper">{item.name}</span>
                          {item.nonVeg && (
                            <span role="img" aria-label="Non-vegetarian" title="Non-vegetarian" className="inline-flex size-3.5 shrink-0 items-center justify-center border border-[#e0675b]">
                              <span className="size-1.5 rounded-full bg-[#e0675b]" />
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
