"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

export type PickedDish = { id: string; name: string };

type EnquiryState = {
  picked: readonly PickedDish[];
  has: (id: string) => boolean;
  toggle: (dish: PickedDish) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const EnquiryCtx = createContext<EnquiryState | null>(null);

export function useEnquiry(): EnquiryState {
  const ctx = useContext(EnquiryCtx);
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return ctx;
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [picked, setPicked] = useState<readonly PickedDish[]>([]);

  const toggle = useCallback((dish: PickedDish) => {
    setPicked((prev) =>
      prev.some((p) => p.id === dish.id) ? prev.filter((p) => p.id !== dish.id) : [...prev, dish],
    );
  }, []);
  const remove = useCallback((id: string) => setPicked((prev) => prev.filter((p) => p.id !== id)), []);
  const clear = useCallback(() => setPicked([]), []);

  const value = useMemo<EnquiryState>(
    () => ({ picked, has: (id) => picked.some((p) => p.id === id), toggle, remove, clear }),
    [picked, toggle, remove, clear],
  );

  return (
    <EnquiryCtx.Provider value={value}>
      {children}
      <SelectionTray />
    </EnquiryCtx.Provider>
  );
}

function SelectionTray() {
  const { picked } = useEnquiry();
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("enquire");
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = picked.length > 0 && !formVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-5 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
        >
          <button
            type="button"
            onClick={() => scrollToId("enquire")}
            className="group flex w-full items-center gap-4 bg-navy px-5 py-3.5 text-left text-paper shadow-[0_18px_40px_-12px_rgba(5,10,22,0.55)] ring-1 ring-gold/40 transition-transform duration-200 ease-out active:scale-[0.98]"
          >
            <UtensilsCrossed aria-hidden="true" className="size-5 shrink-0 text-gold" strokeWidth={1.5} />
            <span className="flex-1 text-sm">
              <motion.span
                key={picked.length}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.35, bounce: 0.35 }}
                className="inline-block font-semibold text-gold-soft"
              >
                {picked.length}
              </motion.span>{" "}
              {picked.length === 1 ? "dish" : "dishes"} in your enquiry
            </span>
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Review
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
