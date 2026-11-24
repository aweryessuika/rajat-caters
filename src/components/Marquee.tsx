import { CUISINES, MARQUEE_ITEMS, SIGNATURES } from "@/lib/content";

const SECOND_ROW = [...SIGNATURES.map((s) => s.name), ...CUISINES];

function Track({ items, reverse = false, big }: { items: readonly string[]; reverse?: boolean; big: boolean }) {
  const row = [...items, ...items];
  return (
    <div className={`marquee-track flex items-center ${reverse ? "marquee-track--reverse" : ""}`} aria-hidden="true">
      {[0, 1].map((copy) => (
        <ul key={copy} className="flex shrink-0 items-center">
          {row.map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-center">
              {big ? (
                <span className="px-8 font-display text-3xl font-light italic tracking-tight text-gold-soft md:px-12 md:text-5xl">{item}</span>
              ) : (
                <span className="px-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-paper/55 md:px-9 md:text-xs">{item}</span>
              )}
              <span className={`block rotate-45 ${big ? "size-1.5 bg-gold" : "size-1 bg-gold/60"}`} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/**
 * Two constant, self-running ribbons (pure CSS, off the main thread) travelling in opposite
 * directions. They deliberately do NOT react to scrolling. Pause on hover; static for reduced motion.
 */
export default function Marquee() {
  return (
    <section aria-label="What we cater" data-dark className="marquee relative z-10 overflow-hidden border-y border-gold/20 bg-navy py-6 md:py-8">
      <div className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] md:gap-5">
        <Track items={MARQUEE_ITEMS} big />
        <Track items={SECOND_ROW} reverse big={false} />
      </div>
      <p className="sr-only">{[...MARQUEE_ITEMS, ...SECOND_ROW].join(", ")}</p>
    </section>
  );
}
