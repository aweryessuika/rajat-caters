"use client";

import { useEffect, useRef } from "react";

const BASE_WGHT = 300;
const PEAK_WGHT = 760;
const REACH = 260; // px of influence around the pointer

/**
 * A wordmark set in the variable display face. Letters swell in weight and softness as a
 * mouse passes over them (direct style writes in rAF, no React re-render), and the whole
 * word ripples once through its weights when it first comes into view. Decorative only.
 */
export default function VariableWordmark({ text, className = "" }: { text: string; className?: string }) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-letter]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const setLetter = (el: HTMLSpanElement, t: number) => {
      const wght = Math.round(BASE_WGHT + (PEAK_WGHT - BASE_WGHT) * t);
      el.style.fontVariationSettings = `"wght" ${wght}, "SOFT" ${Math.round(40 + 60 * t)}`;
    };

    // One ripple when the word enters view (works on touch screens too).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        root.classList.add("is-rippling");
        window.setTimeout(() => root.classList.remove("is-rippling"), 2200 + letters.length * 70);
      },
      { threshold: 0.6 },
    );
    io.observe(root);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return () => io.disconnect();

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const update = () => {
      frame = 0;
      for (const el of letters) {
        const r = el.getBoundingClientRect();
        const dx = pointerX - (r.left + r.width / 2);
        const dy = (pointerY - (r.top + r.height / 2)) * 0.6;
        const d = Math.hypot(dx, dy);
        const t = Math.max(0, 1 - d / REACH);
        setLetter(el, t * t * (3 - 2 * t)); // smoothstep falloff
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      letters.forEach((el) => setLetter(el, 0));
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <span ref={rootRef} aria-hidden="true" className={`variable-wordmark inline-flex whitespace-nowrap ${className}`}>
      {Array.from(text).map((ch, i) => (
        <span key={i} data-letter style={{ animationDelay: `${i * 70}ms` }} className="wordmark-letter inline-block">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
