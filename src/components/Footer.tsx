"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/content";
import { scrollToId, scrollToTop } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer data-dark className="relative z-10 bg-navy px-6 pb-10 text-paper md:px-14">
      <div className="mx-auto max-w-[1400px] border-t border-white/15 pt-14">
        {/* The wrapper (not the clipped text) is what the viewport observer watches. */}
        <motion.div
          aria-hidden="true"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          className="overflow-hidden pb-[0.08em]"
        >
          <motion.p
            variants={{
              hidden: { y: "105%" },
              show: { y: "0%", transition: { duration: 1.3, ease: [0.77, 0, 0.175, 1] } },
            }}
            className="select-none font-display text-[clamp(3.6rem,18.4vw,17rem)] font-light italic leading-[0.92] tracking-tight text-gold-soft/90"
          >
            Rajat Caterers
          </motion.p>
        </motion.div>
        <div className="mt-14 grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Image src="/logo-full.webp" alt="Rajat Caterers" width={160} height={160} className="size-36 object-contain" />
            <p className="eyebrow text-gold">[ Four decades of culinary excellence ]</p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-gold">[ Explore ]</p>
            <ul className="mt-4 flex flex-col">
              {[...NAV_LINKS, { id: "enquire", label: "Enquire" }].map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(l.id);
                    }}
                    className="inline-flex min-h-11 items-center font-display text-2xl font-light transition-colors duration-200 hover:text-gold-soft"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-8">
            <div>
              <p className="eyebrow text-gold">[ Contact ]</p>
              <div className="mt-4 flex flex-col">
                {BRAND.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="inline-flex min-h-11 items-center text-[17px] text-paper/85 transition-colors hover:text-gold-soft">
                    {p.display}
                  </a>
                ))}
              </div>
            </div>
            <address className="text-[17px] not-italic leading-relaxed text-paper/85">
              {BRAND.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center">
          <p className="eyebrow text-paper/55">© {new Date().getFullYear()} Rajat Caterers · Since {BRAND.founded}</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex min-h-11 items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-paper/80 transition-colors hover:text-gold-soft active:scale-[0.97]"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-1" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
