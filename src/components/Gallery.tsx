"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand, Pause, Play, X } from "lucide-react";
import { GALLERY, frameSrc, type GalleryItem } from "@/lib/content";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";

function Card({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: (i: number) => void }) {
  return (
    <li className="w-[78vw] max-w-[460px] shrink-0 md:w-[30vw]">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${item.title}`}
        className="group relative block w-full text-left"
      >
        <span className="relative block aspect-[4/5] overflow-hidden bg-navy">
          <Image
            src={frameSrc(item.frame)}
            alt={item.caption}
            fill
            sizes="(max-width: 768px) 78vw, 30vw"
            draggable={false}
            className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.05]"
            style={{ objectPosition: item.position }}
          />
          <span aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-gold/30" />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/70 to-transparent" />
          <span
            aria-hidden="true"
            className="absolute right-4 top-4 flex size-10 items-center justify-center bg-paper/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <Expand className="size-4" strokeWidth={1.5} />
          </span>
        </span>
        <span className="mt-5 flex items-baseline gap-4">
          <span className="eyebrow text-gold-deep">0{index + 1}</span>
          <span className="font-display text-2xl font-normal leading-tight md:text-3xl">{item.title}</span>
        </span>
      </button>
    </li>
  );
}

export default function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback((dir: 1 | -1) => {
    setOpen((prev) => (prev === null ? prev : (prev + dir + GALLERY.length) % GALLERY.length));
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open !== null && !dlg.open) {
      dlg.showModal();
      lockScroll();
    }
  }, [open]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => {
      setOpen(null);
      unlockScroll();
    };
    dlg.addEventListener("close", onClose);
    return () => dlg.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const item = open !== null ? GALLERY[open] : null;

  return (
    <section id="gallery" className="relative z-10 overflow-hidden px-0 py-28 md:py-44">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between md:px-14">
        <div>
          <FadeUp>
            <Eyebrow>The Showcase</Eyebrow>
          </FadeUp>
          <WordReveal
            text="Set, seasoned and served."
            emphasis={["seasoned"]}
            emphasisClassName="italic text-gold-deep"
            className="mt-6 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[0.98] tracking-tight"
          />
        </div>
        <FadeUp delay={0.15}>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex min-h-12 items-center gap-3 border border-ink/25 px-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink transition-[background-color,color,transform] duration-200 hover:bg-ink hover:text-paper active:scale-[0.97] motion-reduce:hidden"
          >
            {paused ? <Play className="size-4" strokeWidth={1.75} aria-hidden="true" /> : <Pause className="size-4" strokeWidth={1.75} aria-hidden="true" />}
            {paused ? "Play gallery" : "Pause gallery"}
          </button>
        </FadeUp>
      </div>

      {/*
        The strip moves on its own (CSS, off the main thread) and is NOT a scroll container,
        so vertical trackpad scrolling over it is never captured. It pauses on hover and focus.
        With reduced motion it becomes a static wrapped grid.
      */}
      <div className="gallery-marquee mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] motion-reduce:[mask-image:none] md:mt-20">
        <div className={`gallery-track flex w-max motion-reduce:w-full motion-reduce:flex-wrap ${paused ? "is-paused" : ""}`}>
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-label={copy === 0 ? "Photo gallery" : undefined}
              aria-hidden={copy === 1 ? true : undefined}
              inert={copy === 1}
              className={`flex shrink-0 gap-5 pr-5 md:gap-8 md:pr-8 motion-reduce:flex-wrap motion-reduce:px-6 md:motion-reduce:px-14 ${copy === 1 ? "motion-reduce:hidden" : ""}`}
            >
              {GALLERY.map((g, i) => (
                <Card key={g.frame} item={g} index={i} onOpen={setOpen} />
              ))}
            </ul>
          ))}
        </div>
      </div>

      <dialog ref={dialogRef} className="lightbox" aria-label={item ? item.title : "Photo viewer"} onClick={(e) => e.target === e.currentTarget && close()}>
        {item && (
          <div className="relative flex h-full w-full flex-col items-center justify-center px-4 py-16 md:px-20">
            <button type="button" onClick={close} aria-label="Close photo" className="absolute right-3 top-3 flex size-12 items-center justify-center text-white transition-transform duration-200 hover:text-gold active:scale-90 md:right-6 md:top-6">
              <X className="size-7" strokeWidth={1.25} />
            </button>
            <div className="relative aspect-video w-full max-w-6xl overflow-hidden bg-navy">
              <Image key={item.frame} src={frameSrc(item.frame)} alt={item.caption} fill sizes="100vw" className="object-contain" priority />
            </div>
            <div className="mt-6 flex w-full max-w-6xl items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-gold">
                  [ {String((open ?? 0) + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")} ]
                </p>
                <p className="mt-2 font-display text-3xl font-light md:text-4xl">{item.title}</p>
                <p className="mt-1 text-sm text-white/70">{item.caption}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="flex size-12 items-center justify-center border border-white/30 transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-navy active:scale-95">
                  <ArrowLeft className="size-5" strokeWidth={1.5} />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next photo" className="flex size-12 items-center justify-center border border-white/30 transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-navy active:scale-95">
                  <ArrowRight className="size-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
