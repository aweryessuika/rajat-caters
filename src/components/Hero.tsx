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

const FRAME_COUNT = 101;
const CRITICAL = 8;
/** The footage finishes at 88% of the hero's scroll length, then holds on the last frame. */
const SEQUENCE_END = 0.88;

const CAPTIONS = [
  { range: [0.3, 0.4, 0.5, 0.58], eyebrow: "Chapter 02", text: "From one south Delhi kitchen to 10,000+ events.", emphasis: "10,000+" },
  { range: [0.64, 0.72, 0.84, 0.93], eyebrow: "Chapter 03", text: "Every plate carries one promise: create memories that last.", emphasis: "memories" },
] as const;

function loadOrder(): number[] {
  const first: number[] = [];
  const rest: number[] = [];
  for (let i = CRITICAL; i < FRAME_COUNT; i++) (i % 4 === 0 ? first : rest).push(i);
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
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 z-20 px-6 pb-10 md:px-14 md:pb-32">
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [chapter, setChapter] = useState(0);

  const reducedMotion = useReducedMotion();
  const driftX = useSpring(0, { stiffness: 50, damping: 20 });
  const driftY = useSpring(0, { stiffness: 50, damping: 20 });

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.0005 });

  useMotionValueEvent(smooth, "change", (v) => {
    progressRef.current = v;
    const next = v < 0.29 ? 0 : v < 0.62 ? 1 : 2;
    setChapter((prev) => (prev === next ? prev : next));
  });

  /* Preload: first frames gate the preloader, the rest stream in behind it. */
  useEffect(() => {
    let alive = true;
    lockScroll();
    const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
    framesRef.current = frames;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = frameSrc(i);
        frames[i] = img;
      });

    (async () => {
      let done = 0;
      await Promise.all(
        Array.from({ length: CRITICAL }, (_, i) =>
          load(i).then(() => {
            done += 1;
            if (alive) setLoadProgress(Math.round((done / CRITICAL) * 100));
          }),
        ),
      );
      await new Promise((r) => setTimeout(r, 700));
      if (!alive) return;
      setLoaded(true);
      unlockScroll();

      const order = loadOrder();
      for (let i = 0; i < order.length && alive; i += 6) {
        await Promise.all(order.slice(i, i + 6).map(load));
      }
    })();

    return () => {
      alive = false;
      unlockScroll();
    };
  }, []);

  /* Draw loop: only paints when the frame changes. */
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    ctx.imageSmoothingQuality = "high";

    let cw = window.innerWidth;
    let ch = window.innerHeight;
    let drawn = -1;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      drawn = -1;
    };
    resize();
    window.addEventListener("resize", resize);

    const nearestReady = (target: number) => {
      for (let i = target; i >= 0; i--) {
        const img = framesRef.current[i];
        if (img && img.complete && img.naturalWidth > 0) return i;
      }
      return -1;
    };

    const tick = () => {
      const t = Math.min(1, progressRef.current / SEQUENCE_END);
      const wanted = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(t * (FRAME_COUNT - 1))));
      const index = nearestReady(wanted);
      if (index >= 0 && index !== drawn) {
        const img = framesRef.current[index];
        drawn = index;
        const cr = cw / ch;
        const ir = img.naturalWidth / img.naturalHeight;
        let w = cw;
        let h = ch;
        if (cr > ir) h = cw / ir;
        else w = ch * ir;
        const sx = canvas.width / cw;
        ctx.drawImage(img, ((cw - w) / 2) * sx, ((ch - h) / 2) * sx, w * sx, h * sx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [loaded]);

  const scrim = useTransform(smooth, [0, 0.25, 0.3], [1, 0.9, 1]);
  const introOpacity = useTransform(smooth, [0.14, 0.27], [1, 0]);
  const introY = useTransform(smooth, [0.14, 0.27], [0, -44]);
  const cueOpacity = useTransform(smooth, [0, 0.06], [1, 0]);

  return (
    <div id="top" ref={containerRef} className="relative h-[300vh] bg-navy">
      <div
        className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-navy"
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
              Forty years of Delhi’s weddings, galas and celebrations, cooked from family recipes and plated with care.
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
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-5 border border-gold/20 md:inset-8" />
            <motion.div
              animate={{ scale: [0.97, 1, 0.97], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
            >
              <Image src="/logo-mark.png" alt="Rajat Caterers" width={120} height={120} priority className="size-28 rounded-full ring-1 ring-gold/50 md:size-32" />
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
