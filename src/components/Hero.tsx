"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { frameSrc } from "@/lib/content";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import Cta from "@/components/ui/Cta";
import Magnetic from "@/components/ui/Magnetic";
import { WordReveal } from "@/components/ui/Reveal";

/** Laptops use the full 1920px film (101 frames). Phones use a lighter 3:4 slice, every second frame. */
const DESKTOP_FRAMES = 101;
const PHONE_FRAMES = 51;
const phoneSrc = (n: number) => `/sequence-m/m_${String(n).padStart(2, "0")}.webp`;
/** The footage finishes at 88% of the hero's scroll length, then holds on the last frame. */
const SEQUENCE_END = 0.88;

type Frame = ImageBitmap | HTMLImageElement;
const frameW = (f: Frame) => (f instanceof HTMLImageElement ? f.naturalWidth : f.width);
const frameH = (f: Frame) => (f instanceof HTMLImageElement ? f.naturalHeight : f.height);

const CAPTIONS = [
  { range: [0.3, 0.4, 0.5, 0.58], eyebrow: "Chapter 02", text: "From one south Delhi kitchen to 10,000+ events.", emphasis: "10,000+" },
  { range: [0.64, 0.72, 0.84, 0.93], eyebrow: "Chapter 03", text: "Every plate carries one promise: create memories that last.", emphasis: "memories" },
] as const;

/** Spread the remaining frames out first (every 4th), then fill the gaps, so scrubbing early never hits a hole. */
function loadOrder(count: number, critical: number): number[] {
  const first: number[] = [];
  const rest: number[] = [];
  for (let i = critical; i < count; i++) (i % 4 === 0 ? first : rest).push(i);
  return [...first, ...rest];
}

function Caption({
  progress,
  range,
  eyebrow,
  text,
  emphasis,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number, number, number];
  eyebrow: string;
  text: string;
  emphasis: string;
}) {
  const opacity = useTransform(progress, [...range], [0, 1, 1, 0]);
  const y = useTransform(progress, [...range], [36, 0, 0, -36]);
  const before = text.slice(0, text.indexOf(emphasis));
  const after = text.slice(text.indexOf(emphasis) + emphasis.length);
  return (
    // pointer-events-none: these captions sit over the intro, and must never swallow clicks on its CTAs.
    <motion.div style={{ opacity, y }} className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-10 md:px-14 md:pb-32">
      <p className="eyebrow mb-5 text-gold-soft">[ {eyebrow} ]</p>
      <p className="max-w-4xl font-display text-[clamp(2.4rem,6.2vw,5.6rem)] font-normal leading-[1] tracking-tight text-white [text-shadow:0_2px_30px_rgba(5,10,22,0.65)]">
        {before}
        <em className="font-normal text-gold-soft">{emphasis}</em>
        {after}
      </p>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(Frame | undefined)[]>([]);
  const phoneRef = useRef(false);
  const countRef = useRef(DESKTOP_FRAMES);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [chapter, setChapter] = useState(0);

  const reducedMotion = useReducedMotion();
  const driftX = useSpring(0, { stiffness: 50, damping: 20 });
  const driftY = useSpring(0, { stiffness: 50, damping: 20 });

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Smoothed copy drives the captions only. The footage has its own frame-rate-independent smoothing below.
  const smooth = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.0005 });

  useMotionValueEvent(smooth, "change", (v) => {
    const next = v < 0.29 ? 0 : v < 0.62 ? 1 : 2;
    setChapter((prev) => (prev === next ? prev : next));
  });

  /* Preload: the first few frames gate the loader, the rest stream in behind it. */
  useEffect(() => {
    let alive = true;
    lockScroll();

    const phone = window.matchMedia("(max-width: 767px)").matches;
    const count = phone ? PHONE_FRAMES : DESKTOP_FRAMES;
    const critical = phone ? 4 : 8;
    const batch = phone ? 4 : 6;
    phoneRef.current = phone;
    countRef.current = count;
    const frames: (Frame | undefined)[] = new Array(count);
    framesRef.current = frames;
    const src = (i: number) => (phone ? phoneSrc(i) : frameSrc(i));

    const load = async (i: number) => {
      try {
        if (phone && "createImageBitmap" in window) {
          // Decoded once, off the main thread, so scrubbing never pays for decoding.
          const res = await fetch(src(i));
          frames[i] = await createImageBitmap(await res.blob());
        } else {
          const img = new window.Image();
          img.src = src(i);
          await img.decode();
          frames[i] = img;
        }
      } catch (err) {
        // A frame that fails to load is skipped; the nearest earlier frame stays on screen.
        console.warn("Hero frame failed to load", i, err);
      }
    };

    (async () => {
      let done = 0;
      await Promise.all(
        Array.from({ length: critical }, (_, i) =>
          load(i).then(() => {
            done += 1;
            if (alive) setLoadProgress(Math.round((done / critical) * 100));
          }),
        ),
      );
      await new Promise((r) => setTimeout(r, phone ? 450 : 700));
      if (!alive) return;
      setLoaded(true);
      unlockScroll();

      const order = loadOrder(count, critical);
      for (let i = 0; i < order.length && alive; i += batch) {
        await Promise.all(order.slice(i, i + batch).map(load));
      }
    })();

    return () => {
      alive = false;
      unlockScroll();
      frames.forEach((f) => {
        if (typeof ImageBitmap !== "undefined" && f instanceof ImageBitmap) f.close();
      });
    };
  }, []);

  /* Draw loop: eases toward the scroll position, blends neighbouring frames, repaints only on change. */
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !stage || !ctx) return;
    ctx.imageSmoothingQuality = "medium";

    const count = countRef.current;
    const maxDpr = phoneRef.current ? 1.5 : 1.75;
    let cw = 0;
    let ch = 0;
    let pos = -1;
    let drawnPos = -2;
    let last = performance.now();
    let raf = 0;

    const resize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      // Phones fire resize while the address bar slides in and out. Resizing the canvas clears it,
      // which shows up as flicker, so ignore pure height wobble.
      if (cw && w === cw && Math.abs(h - ch) < 160) return;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      cw = w;
      ch = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      drawnPos = -2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const paint = (f: Frame, alpha: number) => {
      const iw = frameW(f);
      const ih = frameH(f);
      const scale = Math.max(canvas.width / iw, canvas.height / ih);
      const w = iw * scale;
      const h = ih * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(f, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };

    const draw = (p: number) => {
      const frames = framesRef.current;
      const lo = Math.min(count - 1, Math.floor(p));
      let base = -1;
      for (let k = lo; k >= 0; k--) {
        if (frames[k]) {
          base = k;
          break;
        }
      }
      if (base < 0) return;
      paint(frames[base] as Frame, 1);
      const next = frames[lo + 1];
      const frac = p - lo;
      if (next && frac > 0.015) paint(next, frac);
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = Math.min(1, Math.max(0, scrollYProgress.get() / SEQUENCE_END)) * (count - 1);
      if (pos < 0) pos = target;
      else pos += (target - pos) * (1 - Math.exp(-dt * 14));
      if (Math.abs(target - pos) < 0.003) pos = target;
      if (pos !== drawnPos) {
        draw(pos);
        drawnPos = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [loaded, scrollYProgress]);

  const scrim = useTransform(smooth, [0, 0.25, 0.3], [1, 0.9, 1]);
  const introOpacity = useTransform(smooth, [0.14, 0.27], [1, 0]);
  const introY = useTransform(smooth, [0.14, 0.27], [0, -44]);
  const cueOpacity = useTransform(smooth, [0, 0.06], [1, 0]);

  return (
    <div id="top" ref={containerRef} className="relative h-[300vh] bg-navy">
      <div
        ref={stageRef}
        className="sticky top-0 h-svh w-full overflow-hidden bg-navy"
        onPointerMove={(e) => {
          if (reducedMotion || e.pointerType !== "mouse") return;
          driftX.set(-(e.clientX / window.innerWidth - 0.5) * 24);
          driftY.set(-(e.clientY / window.innerHeight - 0.5) * 14);
        }}
      >
        {/* Footage drifts a few pixels against the pointer. Scaled up so edges never show. */}
        <motion.div style={{ x: driftX, y: driftY, scale: 1.05 }} className="absolute inset-0">
          {/* Poster frame: first paint, no-JS fallback, and LCP element. */}
          <Image src={frameSrc(0)} alt="" fill priority sizes="100vw" className="object-cover" />
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="A golden buffet set on a lawn, then a chef plating food in the kitchen"
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        </motion.div>

        {/* Legibility scrims */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: scrim }}
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(6,12,24,0.88)_0%,rgba(6,12,24,0.45)_38%,rgba(6,12,24,0.12)_70%,transparent_100%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-navy/10" />

        {/* Chapter 01 */}
        <motion.div style={{ opacity: introOpacity, y: introY }} className="absolute inset-x-0 bottom-0 z-20 px-6 pb-8 md:px-14 md:pb-28">
          <p className="eyebrow mb-6 text-gold-soft">[ Est. 1986 · New Delhi ]</p>
          {loaded ? (
            <WordReveal
              as="h1"
              immediate
              delay={0.15}
              text="The Art of the Banquet"
              emphasis={["Banquet"]}
              emphasisClassName="italic font-normal text-gold-soft"
              className="max-w-5xl font-display text-[clamp(3rem,10vw,9.5rem)] font-light leading-[0.88] tracking-tight text-white"
            />
          ) : (
            <h1 className="max-w-5xl font-display text-[clamp(3rem,10vw,9.5rem)] font-light leading-[0.88] tracking-tight text-white opacity-0">
              The Art of the Banquet
            </h1>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between md:gap-8"
          >
            <p className="max-w-md text-base leading-relaxed text-white/85 md:text-lg [@media(max-height:700px)]:hidden">
              Forty years of Delhi’s weddings and galas, cooked from family recipes. Now in Delhi NCR and at destination weddings worldwide.
            </p>
            <div className="flex flex-wrap gap-3 [&>div]:max-[420px]:w-full [&_a]:whitespace-nowrap max-[420px]:[&_a]:w-full max-[420px]:[&_a]:justify-between">
              <Magnetic>
                <Cta href="#enquire">Plan your event</Cta>
              </Magnetic>
              <Magnetic>
                <Cta href="#menu" variant="outline-light">
                  Explore the menu
                </Cta>
              </Magnetic>
            </div>
          </motion.div>
        </motion.div>

        {/* Chapters 02 and 03 */}
        {CAPTIONS.map((c) => (
          <Caption key={c.eyebrow} progress={smooth} range={c.range} eyebrow={c.eyebrow} text={c.text} emphasis={c.emphasis} />
        ))}

        {/* Chapter ticks */}
        <ol aria-hidden="true" className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-3">
              <span className={`eyebrow transition-opacity duration-500 ${chapter === i ? "text-gold-soft opacity-100" : "text-white opacity-0"}`}>
                0{i + 1}
              </span>
              <span className={`block h-px transition-[width,background-color] duration-500 ease-out-expo ${chapter === i ? "w-10 bg-gold" : "w-5 bg-white/40"}`} />
            </li>
          ))}
        </ol>

        {/* Scroll cue */}
        <motion.div style={{ opacity: cueOpacity }} aria-hidden="true" className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 [@media(min-width:768px)_and_(min-height:800px)]:flex">
          <span className="eyebrow text-white/70">Scroll</span>
          <span className="scroll-cue block h-10 w-px bg-gold" />
        </motion.div>

      </div>

      {/* Preloader */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            data-dark
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-navy"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-5 border border-gold/20 md:inset-8" />
            <motion.div
              animate={{ scale: [0.97, 1, 0.97], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
            >
              <Image src="/logo-badge.png" alt="Rajat Caterers" width={256} height={256} priority className="size-40 object-contain md:size-52" />
            </motion.div>
            <div className="relative mt-10 h-px w-40 overflow-hidden bg-white/10 md:w-56">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ type: "spring", stiffness: 70, damping: 24 }}
              />
            </div>
            <p className="eyebrow mt-5 text-gold-soft" role="status">
              Setting the table
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
