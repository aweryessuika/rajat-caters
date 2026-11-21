"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, Search, X } from "lucide-react";
import { MENU, type Dish, type MenuCategory } from "@/lib/content";
import { useEnquiry } from "@/components/EnquiryContext";
import { Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";
import Cta from "@/components/ui/Cta";

function NonVegMark() {
  return (
    <span
      role="img"
      aria-label="Non-vegetarian"
      title="Non-vegetarian"
      className="mt-[0.7em] inline-flex size-3.5 shrink-0 items-center justify-center border border-nonveg"
    >
      <span className="size-1.5 rounded-full bg-nonveg" />
    </span>
  );
}

function DishRow({ dish, where }: { dish: Dish; where?: string }) {
  const { has, toggle } = useEnquiry();
  const picked = has(dish.id);
  return (
    <li className="group flex items-start gap-3 border-b border-ink/10 py-4 transition-colors duration-300 hover:border-gold-deep/50">
      <NonVegMark />
      <div className="min-w-0 flex-1">
        <p className={`font-display text-2xl font-normal leading-tight tracking-tight transition-colors duration-300 md:text-[28px] ${picked ? "text-gold-deep" : "text-ink group-hover:text-gold-deep"}`}>
          {dish.name}
        </p>
        {dish.note && <p className="mt-1 max-w-md text-sm leading-relaxed text-ink/70">{dish.note}</p>}
        {where && <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/65">{where}</p>}
      </div>
      <button
        type="button"
        aria-pressed={picked}
        aria-label={`${picked ? "Remove" : "Add"} ${dish.name} ${picked ? "from" : "to"} your enquiry`}
        onClick={() => toggle({ id: dish.id, name: dish.name })}
        className={`-mr-2 -mt-1 flex size-12 shrink-0 items-center justify-center transition-transform duration-150 ease-out active:scale-90`}
      >
        <span
          className={`flex size-9 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-300 ${
            picked ? "border-gold-deep bg-gold-deep text-paper" : "border-ink/25 text-ink/70 group-hover:border-gold-deep group-hover:text-gold-deep"
          }`}
        >
          {picked ? <Check className="size-4" strokeWidth={2} /> : <Plus className="size-4" strokeWidth={1.75} />}
        </span>
      </button>
    </li>
  );
}

function Groups({ category }: { category: MenuCategory }) {
  return (
    <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
      {category.groups.map((group) => (
        <section key={group.title} aria-label={group.title} className={category.groups.length === 1 ? "md:col-span-2 md:max-w-3xl" : ""}>
          <div className="flex items-baseline justify-between border-b border-ink/30 pb-3">
            <h3 className="font-display text-3xl font-light italic text-gold-deep">{group.title}</h3>
            <span className="eyebrow text-ink/60">{String(group.dishes.length).padStart(2, "0")}</span>
          </div>
          <ul>
            {group.dishes.map((dish) => (
              <DishRow key={dish.id} dish={dish} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function Menu() {
  const [activeId, setActiveId] = useState<string>(MENU[0].id);
  const [query, setQuery] = useState("");
  const searchId = useId();
  const active = MENU.find((c) => c.id === activeId) ?? MENU[0];

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return MENU.flatMap((cat) =>
      cat.groups.flatMap((g) =>
        g.dishes
          .filter((dish) => `${dish.name} ${dish.note ?? ""}`.toLowerCase().includes(q))
          .map((dish) => ({ dish, where: `${cat.label} · ${g.title}` })),
      ),
    );
  }, [q]);

  return (
    <section id="menu" className="relative z-10 border-t border-ink/10 bg-paper-2/60 px-6 py-28 md:px-14 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeUp>
              <Eyebrow>The Celebration Menu</Eyebrow>
            </FadeUp>
            <WordReveal
              text="A table worth gathering around."
              emphasis={["gathering"]}
              emphasisClassName="italic text-gold-deep"
              className="mt-6 max-w-3xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[0.98] tracking-tight"
            />
            <FadeUp delay={0.15}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/75 md:text-lg">
                Non-vegetarian starters, gravies, biryanis and live counters. Tap <span className="font-semibold text-gold-deep">+</span> to add a dish to your enquiry and we will build the menu around it.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.2} className="w-full md:max-w-xs">
            <label htmlFor={searchId} className="eyebrow mb-2 block text-ink/60">
              Search dishes
            </label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-ink/50" strokeWidth={1.75} />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Biryani, tikka, prawn…"
                autoComplete="off"
                className="h-12 w-full border-0 border-b border-ink/30 bg-transparent pl-7 pr-9 text-base text-ink outline-none transition-colors duration-200 placeholder:text-ink/45 focus:border-gold-deep"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-ink/60 transition-transform duration-150 active:scale-90"
                >
                  <X className="size-4" strokeWidth={1.75} />
                </button>
              )}
            </div>
          </FadeUp>
        </div>

        {/* Tabs */}
        {!q && (
          <div className="mt-14 md:mt-20">
            <div role="tablist" aria-label="Menu categories" className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:gap-10 md:px-0">
              {MENU.map((cat) => {
                const selected = cat.id === activeId;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    id={`tab-${cat.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${cat.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(cat.id)}
                    onKeyDown={(e) => {
                      const i = MENU.findIndex((c) => c.id === activeId);
                      if (e.key === "ArrowRight") setActiveId(MENU[(i + 1) % MENU.length].id);
                      if (e.key === "ArrowLeft") setActiveId(MENU[(i - 1 + MENU.length) % MENU.length].id);
                    }}
                    className={`relative shrink-0 whitespace-nowrap px-1 py-4 font-display text-3xl font-light tracking-tight transition-colors duration-300 active:scale-[0.98] md:text-5xl ${
                      selected ? "text-ink" : "text-ink/40 hover:text-ink/75"
                    }`}
                  >
                    {cat.label}
                    {selected && <motion.span layoutId="menu-tab-underline" className="absolute inset-x-0 bottom-0 h-px bg-gold-deep" transition={{ type: "spring", duration: 0.5, bounce: 0.15 }} />}
                  </button>
                );
              })}
            </div>
            <div className="h-px w-full bg-ink/15" />
          </div>
        )}

        <div className="mt-12 md:mt-16" aria-live="polite">
          {q ? (
            <div>
              <p className="eyebrow mb-8 text-ink/60">
                [ {results.length} {results.length === 1 ? "result" : "results"} for “{query.trim()}” ]
              </p>
              {results.length > 0 ? (
                <ul className="grid gap-x-16 md:grid-cols-2">
                  {results.map(({ dish, where }) => (
                    <DishRow key={dish.id} dish={dish} where={where} />
                  ))}
                </ul>
              ) : (
                <div className="max-w-xl border border-dashed border-ink/25 p-8">
                  <p className="font-display text-3xl font-light italic">Not on the list? We can still make it.</p>
                  <p className="mt-3 text-ink/75">Every menu is customised. Tell us the dish and we will cook it for your event.</p>
                  <div className="mt-6">
                    <Cta href="#enquire" variant="outline-ink">
                      Ask us
                    </Cta>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                role="tabpanel"
                id={`panel-${active.id}`}
                aria-labelledby={`tab-${active.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
              >
                <p className="mb-10 max-w-xl font-display text-2xl font-light italic text-ink/75">{active.blurb}</p>
                <Groups category={active} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <FadeUp className="mt-20 flex flex-col items-start gap-6 border-t border-ink/15 pt-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-sm text-ink/75">
            <NonVegMark />
            <span>Non-vegetarian. Vegetarian and mixed menus are customised to your requirement.</span>
          </div>
          <Cta href="#enquire">Request a tailored menu</Cta>
        </FadeUp>
      </div>
    </section>
  );
}
