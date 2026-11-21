import { MARQUEE_ITEMS } from "@/lib/content";

/**
 * Constant, self-running ribbon (pure CSS, off the main thread). It deliberately does NOT
 * react to scrolling. Pauses on hover; static for reduced motion.
 */
export default function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <section aria-label="What we cater" data-dark className="marquee relative z-10 overflow-hidden border-y border-gold/20 bg-navy py-6 md:py-8">
      <div className="[mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
        <div className="marquee-track flex items-center" aria-hidden="true">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {row.map((item, i) => (
                <li key={`${item}-${i}`} className="flex items-center">
                  <span className="px-8 font-display text-3xl font-light italic tracking-wide text-gold-soft md:px-12 md:text-5xl">{item}</span>
                  <span className="block size-1.5 rotate-45 bg-gold" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <p className="sr-only">{MARQUEE_ITEMS.join(", ")}</p>
    </section>
  );
}
