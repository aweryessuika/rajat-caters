"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react";
import { BRAND, TESTIMONIALS, type Testimonial } from "@/lib/content";
import { EASE, Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";
import Cta from "@/components/ui/Cta";

const DWELL_MS = 9000;
const pad = (n: number) => String(n).padStart(2, "0");
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

const SHARE_URL = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hello Rajat Caterers, I would like to share a review of my event:")}`;

type Fling = (dir: -1 | 1) => void;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Words of the front card come into focus one after another, each time it reaches the front. */
function QuoteWords({ text, play }: { text: string; play: boolean }) {
  const words = text.split(" ");
  return (
    <motion.p
      initial="hidden"
      animate={play ? "show" : "hidden"}
      transition={{ staggerChildren: 0.018, delayChildren: 0.12 }}
      className="font-display text-[clamp(1.25rem,2.1vw,1.85rem)] font-light leading-[1.38] tracking-tight text-ink"
    >
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden="true"
          className="tm-word inline"
          variants={{
            hidden: { opacity: 0.08, filter: "blur(5px)" },
            show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
          }}
        >
          {w}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
}

function Stars({ count, play }: { count: number; play: boolean }) {
  return (
    <motion.div
      role="img"
      aria-label={`Rated ${count} out of 5`}
      initial="hidden"
      animate={play ? "show" : "hidden"}
      transition={{ staggerChildren: 0.07, delayChildren: 0.35 }}
      className="flex items-center gap-1"
    >
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, scale: 0.6, rotate: -20 },
            show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", duration: 0.5, bounce: 0.45 } },
          }}
          className="inline-flex"
        >
          <Star className="size-4 fill-gold text-gold" strokeWidth={1.25} />
        </motion.span>
      ))}
    </motion.div>
  );
}

function Card({
  t,
  depth,
  play,
  register,
  onGone,
}: {
  t: Testimonial;
  depth: number;
  play: boolean;
  register: (id: string, fling: Fling | null) => void;
  onGone: (id: string) => void;
}) {
  const front = depth === 0;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-320, 320], [-9, 9]);
  const [leaving, setLeaving] = useState(false);

  const fling = useCallback<Fling>(
    (dir) => {
      setLeaving(true);
      const distance = Math.max(window.innerWidth * 0.7, 520);
      animate(x, dir * distance, { duration: 0.42, ease: [0.4, 0, 1, 1] }).then(() => {
        onGone(t.id);
        x.jump(0);
        setLeaving(false);
      });
    },
    [onGone, t.id, x],
  );

  useEffect(() => {
    register(t.id, fling);
    return () => register(t.id, null);
  }, [fling, register, t.id]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // A quick flick is enough (velocity), as is a long drag (distance).
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 500) {
      fling(info.offset.x < 0 ? -1 : 1);
    } else {
      animate(x, 0, { type: "spring", duration: 0.5, bounce: 0.25 });
    }
  };

  return (
    <motion.article
      aria-hidden={!front}
      style={{ x, rotate, zIndex: 10 - depth, gridArea: "1 / 1", touchAction: "pan-y" }}
      initial={false}
      animate={{
        y: depth * -18,
        scale: 1 - depth * 0.05,
        opacity: leaving ? 0 : depth > 2 ? 0 : 1,
      }}
      transition={{
        y: { type: "spring", duration: 0.6, bounce: 0.18 },
        scale: { type: "spring", duration: 0.6, bounce: 0.18 },
        opacity: { duration: leaving ? 0.38 : 0.45, ease: EASE },
      }}
      drag={front && !leaving ? "x" : false}
      dragElastic={0.55}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      className={`tm-card relative flex h-full origin-top flex-col justify-between border border-ink/10 bg-paper p-7 shadow-[0_1px_1px_rgba(11,21,35,0.04),0_8px_16px_-6px_rgba(11,21,35,0.08),0_32px_64px_-24px_rgba(11,21,35,0.22)] md:p-11 ${
        front ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      <div>
        <div className={`flex h-12 items-start justify-between gap-4 transition-opacity duration-300 md:h-14 ${front ? "opacity-100" : "opacity-0"}`}>
          <span aria-hidden="true" className="-ml-1 -mt-3 font-display text-[8.5rem] font-light italic leading-[0.8] text-gold md:-mt-5 md:text-[11rem]">
            “
          </span>
          <span className="eyebrow mt-2 whitespace-nowrap text-ink/55">{t.context}</span>
        </div>
        <div className={`mt-6 transition-opacity duration-300 md:mt-8 ${front ? "opacity-100" : "opacity-0"}`}>
          <QuoteWords text={t.quote} play={play && front && !leaving} />
        </div>
      </div>

      <footer className={`mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-ink/10 pt-6 transition-opacity duration-300 ${front ? "opacity-100" : "opacity-0"}`}>
        <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold-deep/40 font-display text-lg italic text-gold-deep">
          {initials(t.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg leading-tight text-ink sm:text-xl md:text-2xl">{t.name}</p>
          {t.role && <p className="mt-1 text-sm text-ink/65">{t.role}</p>}
        </div>
        {t.rating && (
          <div className="max-sm:w-full max-sm:pl-16">
            <Stars count={t.rating} play={play && front && !leaving} />
          </div>
        )}
      </footer>
    </motion.article>
  );
}

export default function Testimonials() {
  const [order, setOrder] = useState<string[]>(() => TESTIMONIALS.map((t) => t.id));
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  // Reduced motion: no autoplay (server snapshot = false, so markup matches on hydration).
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false);
  const flings = useRef(new Map<string, Fling>());
  const sectionRef = useRef<HTMLElement>(null);

  const register = useCallback((id: string, fling: Fling | null) => {
    if (fling) flings.current.set(id, fling);
    else flings.current.delete(id);
  }, []);

  // The card that left goes to the back of the deck.
  const onGone = useCallback((id: string) => {
    setOrder((prev) => [...prev.filter((p) => p !== id), id]);
  }, []);

  const next = useCallback(() => {
    flings.current.get(order[0])?.(-1);
  }, [order]);

  const prev = () => setOrder((p) => [p[p.length - 1], ...p.slice(0, -1)]);

  const goTo = (id: string) => {
    if (id === order[0]) return;
    setOrder((p) => {
      const i = p.indexOf(id);
      return [...p.slice(i), ...p.slice(0, i)];
    });
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const onVis = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Autoplay pauses whenever someone is reading or interacting, or nobody can see it.
  const paused = userPaused || hovering || focused || !inView || docHidden || reduced;
  const front = TESTIMONIALS.find((t) => t.id === order[0]) ?? TESTIMONIALS[0];
  const frontIndex = TESTIMONIALS.findIndex((t) => t.id === front.id);

  return (
    <section ref={sectionRef} id="testimonials" aria-roledescription="carousel" aria-label="Client reviews" className="relative z-10 overflow-hidden px-6 py-28 md:px-14 md:py-44">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Left: heading, counter, controls */}
        <div className="flex flex-col lg:col-span-5">
          <FadeUp>
            <Eyebrow>Kind Words</Eyebrow>
          </FadeUp>
          <WordReveal
            text="Said at the table, after the last plate."
            emphasis={["table,"]}
            emphasisClassName="italic text-gold-deep"
            className="mt-6 font-display text-[clamp(2.6rem,5.4vw,5rem)] font-light leading-[0.98] tracking-tight"
          />
          <FadeUp delay={0.15}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/75 md:text-lg">
              From family celebrations to the offices of CGST and the Enforcement Directorate, in our clients’ own words.
            </p>
          </FadeUp>

          <FadeUp delay={0.2} className="mt-12 lg:mt-auto lg:pt-16">
            <div className="flex items-end justify-between gap-6">
              <p className="font-display text-[clamp(4rem,7vw,6rem)] font-light leading-none tracking-tight text-gold-deep tabular-nums lining-nums" aria-live="polite">
                <span className="relative inline-block h-[1em] overflow-hidden align-bottom">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={front.id}
                      initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
                      animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="inline-block"
                    >
                      {pad(frontIndex + 1)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="ml-3 align-baseline font-sans text-sm tracking-[0.2em] text-ink/45">/ {pad(TESTIMONIALS.length)}</span>
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={prev} aria-label="Previous review" className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-[background-color,color,border-color,transform] duration-200 ease-out hover:border-ink hover:bg-ink hover:text-paper active:scale-[0.95]">
                  <ArrowLeft className="size-4" strokeWidth={1.75} />
                </button>
                <button type="button" onClick={next} aria-label="Next review" className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-[background-color,color,border-color,transform] duration-200 ease-out hover:border-ink hover:bg-ink hover:text-paper active:scale-[0.95]">
                  <ArrowRight className="size-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  aria-label={userPaused ? "Play reviews" : "Pause reviews"}
                  aria-pressed={userPaused}
                  className="flex size-12 items-center justify-center rounded-full text-ink/70 transition-[color,transform] duration-200 ease-out hover:text-ink active:scale-[0.95]"
                >
                  {userPaused ? <Play className="size-4" strokeWidth={1.75} /> : <Pause className="size-4" strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {/* Who's who: the active reviewer's line fills as their review plays. */}
            <ul className="mt-8 border-t border-ink/15" aria-label="Reviewers">
              {TESTIMONIALS.map((t) => {
                const on = t.id === front.id;
                return (
                  <li key={t.id} className="relative border-b border-ink/15">
                    <button type="button" onClick={() => goTo(t.id)} aria-current={on ? "true" : undefined} className="flex w-full items-baseline justify-between gap-4 py-4 text-left">
                      <span className={`font-display text-xl transition-colors duration-300 md:text-2xl ${on ? "italic text-ink" : "text-ink/45 hover:text-ink/75"}`}>{t.name}</span>
                      <span className={`truncate text-xs transition-colors duration-300 ${on ? "text-ink/70" : "text-ink/40"}`}>{t.role ?? t.context}</span>
                    </button>
                    {on && (
                      <span
                        key={`${t.id}-${order.join()}`}
                        aria-hidden="true"
                        onAnimationEnd={next}
                        style={{ animationDuration: `${DWELL_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                        className="tm-progress absolute -bottom-px left-0 h-px w-full origin-left bg-gold-deep"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </FadeUp>
        </div>

        {/* Right: the deck */}
        <div className="lg:col-span-7">
          <div
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="relative grid pt-10"
          >
            {TESTIMONIALS.map((t) => (
              <Card key={t.id} t={t} depth={order.indexOf(t.id)} play={inView} register={register} onGone={onGone} />
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="eyebrow text-ink/50">[ Drag or swipe the card ]</p>
            <Cta href={SHARE_URL} variant="outline-ink" external>
              Eaten with us? Tell us
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
