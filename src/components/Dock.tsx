"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { BRAND } from "@/lib/content";

const WA_URL = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hello Rajat Caterers, I would like to enquire about catering.")}`;

export default function Dock() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    // Visible after the hero, hidden again near the page bottom so it never covers "Back to top".
    const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - 220;
    const next = y > window.innerHeight * 3.1 && !nearBottom;
    setShow((prev) => (prev === next ? prev : next));
  });

  const base =
    "group relative flex size-12 items-center justify-center rounded-full shadow-[0_10px_28px_-10px_rgba(5,10,22,0.6)] transition-transform duration-200 ease-out active:scale-95";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          // On phones the dock sits above the dish tray (which lives at the bottom) so they never overlap.
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + var(--dock-bottom, 1.25rem))" }}
          className="fixed right-4 z-[60] flex flex-col gap-3 [--dock-bottom:5.5rem] md:right-6 md:[--dock-bottom:1.25rem]"
        >
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Rajat Caterers on WhatsApp"
            className={`${base} bg-gold text-navy`}
          >
            <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.75} />
            <span className="pointer-events-none absolute right-14 hidden whitespace-nowrap bg-navy px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft opacity-0 transition-opacity duration-200 md:block md:group-hover:opacity-100">
              WhatsApp
            </span>
          </a>
          <a href={`tel:${BRAND.phones[0].tel}`} aria-label={`Call ${BRAND.phones[0].display}`} className={`${base} bg-navy text-gold ring-1 ring-gold/50`}>
            <Phone aria-hidden="true" className="size-5" strokeWidth={1.75} />
            <span className="pointer-events-none absolute right-14 hidden whitespace-nowrap bg-navy px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft opacity-0 transition-opacity duration-200 md:block md:group-hover:opacity-100">
              Call us
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
