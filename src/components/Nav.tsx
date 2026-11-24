"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/content";
import { lockScroll, scrollToId, scrollToTop, unlockScroll } from "@/lib/scroll";

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const heroEnd = typeof window === "undefined" ? 1600 : window.innerHeight * 3 - 80;
    setSolid(y > heroEnd);
    setHidden(y > heroEnd && y > prev + 2 ? true : y < prev - 2 ? false : hidden);
  });

  useEffect(() => {
    const ids = [...NAV_LINKS.map((l) => l.id), "enquire"];
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Move focus into the menu when it opens, and back to its trigger when it closes.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      closeButtonRef.current?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      menuButtonRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open]);

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    // Let the overlay release the scroll lock before scrolling.
    window.setTimeout(() => scrollToId(id), open ? 60 : 0);
  };

  const dark = !solid;
  const linkTone = dark ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-ink";

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-[background-color,border-color] duration-500 ${
          solid ? "border-b border-ink/10 bg-paper/92" : "border-b border-transparent bg-transparent"
        }`}
      >
        {!solid && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy/70 to-transparent" />
        )}
        <nav aria-label="Primary" className="relative mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 md:px-12">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            aria-label="Rajat Caterers, back to top"
            className="flex items-center gap-3"
          >
            <Image src="/logo-badge.png" alt="" width={112} height={112} priority className="size-12 object-contain md:size-14" />
            <span className={`hidden font-display text-[22px] font-medium tracking-wide sm:block ${dark ? "text-white" : "text-ink"}`}>
              Rajat Caterers
            </span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  aria-current={active === link.id ? "true" : undefined}
                  className={`group relative py-2 text-[11px] font-semibold uppercase tracking-[0.26em] transition-colors duration-200 ${linkTone}`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ease-out-expo ${
                      active === link.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#enquire"
              onClick={go("enquire")}
              className={`hidden min-h-11 items-center border px-6 text-[11px] font-semibold uppercase tracking-[0.26em] transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97] sm:inline-flex ${
                dark
                  ? "border-white/45 text-white hover:bg-white hover:text-navy"
                  : "border-ink/30 text-ink hover:bg-ink hover:text-paper"
              }`}
            >
              Enquire
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={`inline-flex size-11 items-center justify-center transition-transform duration-200 active:scale-95 lg:hidden ${dark ? "text-white" : "text-ink"}`}
            >
              <Menu className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </nav>
        <motion.div aria-hidden="true" style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-dark
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[90] flex flex-col bg-navy px-6 pb-10 pt-5 text-paper"
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow text-gold">[ Menu ]</span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center text-paper transition-transform duration-200 active:scale-95"
              >
                <X className="size-6" strokeWidth={1.5} />
              </button>
            </div>
            <ul className="mt-10 flex flex-1 flex-col justify-center gap-1">
              {[...NAV_LINKS, { id: "enquire", label: "Enquire" }].map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={go(link.id)}
                    className="flex items-baseline gap-4 border-b border-white/10 py-3 font-display text-[clamp(2.1rem,9vw,3rem)] font-light tracking-tight transition-colors duration-200 active:text-gold"
                  >
                    <span className="eyebrow text-gold/80">0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-x-4 text-sm text-paper/80">
              {BRAND.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="inline-flex min-h-11 items-center">
                  {p.display}
                </a>
              ))}
              <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
                WhatsApp
              </a>
              <a href={`mailto:${BRAND.email}`} className="inline-flex min-h-11 items-center">
                Email us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
