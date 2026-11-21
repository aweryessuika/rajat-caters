"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";
import { BRAND, EVENT_TYPES } from "@/lib/content";
import { useEnquiry, type PickedDish } from "@/components/EnquiryContext";
import { scrollToId } from "@/lib/scroll";
import { Eyebrow, FadeUp, WordReveal } from "@/components/ui/Reveal";
import Spotlight from "@/components/ui/Spotlight";
import Magnetic from "@/components/ui/Magnetic";

type Errors = Partial<Record<"name" | "phone" | "email", string>>;

const inputBase =
  "w-full min-w-0 border-0 border-b bg-transparent py-3 font-display text-2xl font-light text-paper outline-none transition-colors duration-200 placeholder:text-paper/35 focus:border-gold md:text-[28px]";

function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return null;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function AnimatedGuests({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 120, damping: 22 });
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString("en-IN"));
  return <motion.span>{text}</motion.span>;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-white/10 py-4 last:border-b-0">
      <dt className="eyebrow shrink-0 text-gold">{label}</dt>
      <dd className="text-right font-display text-2xl font-light leading-tight text-paper">{children}</dd>
    </div>
  );
}

const swap = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] as const } };

function OccasionCard({
  name,
  type,
  date,
  guests,
  picked,
  sent,
}: {
  name: string;
  type: string;
  date: string;
  guests: number;
  picked: readonly PickedDish[];
  sent: boolean;
}) {
  const first = name.trim().split(" ")[0];
  const shown = picked.slice(0, 3);
  return (
    <div className="relative border border-gold/40 p-1.5">
      <div className="relative border border-gold/20 p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-gold">[ Your occasion ]</p>
            <p className="mt-3 font-display text-3xl font-light italic text-gold-soft">{first ? `For ${first}` : "Taking shape"}</p>
          </div>
          <Image src="/logo-mark.png" alt="" width={48} height={48} className="size-12 rounded-full ring-1 ring-gold/40" />
        </div>

        <dl className="mt-6">
          <Row label="Event">
            <motion.span key={type} {...swap} className="inline-block">
              {type}
            </motion.span>
          </Row>
          <Row label="Date">
            <motion.span key={date || "tbd"} {...swap} className="inline-block">
              {date ? formatDate(date) : "To be decided"}
            </motion.span>
          </Row>
          <Row label="Guests">
            <span aria-label={`About ${guests} guests`}>
              ~ <AnimatedGuests value={guests} />
            </span>
          </Row>
          <Row label="Dishes">
            {picked.length === 0 ? (
              <span className="text-paper/55">Chosen with you</span>
            ) : (
              <span className="flex flex-col items-end">
                {shown.map((d) => (
                  <span key={d.id}>{d.name}</span>
                ))}
                {picked.length > shown.length && <span className="text-base text-gold-soft">+ {picked.length - shown.length} more</span>}
              </span>
            )}
          </Row>
        </dl>

        <p className="eyebrow mt-6 flex items-center gap-3 text-paper/60">
          <span aria-hidden="true" className={`size-1.5 rounded-full ${sent ? "bg-gold" : "bg-paper/40"}`} />
          {sent ? "Ready to send on WhatsApp" : "Draft, updates as you type"}
        </p>

        <AnimatePresence>
          {sent && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.8, rotate: -26 }}
              animate={{ opacity: 1, scale: 1, rotate: -12 }}
              transition={{ type: "spring", duration: 0.55, bounce: 0.28 }}
              className="pointer-events-none absolute -right-3 -top-5 flex size-20 items-center justify-center rounded-full border border-gold bg-navy text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.18em] text-gold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
            >
              Enquiry
              <br />
              sent
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Enquire() {
  const { picked, remove, clear } = useEnquiry();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<(typeof EVENT_TYPES)[number]>("Wedding");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(250);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const validate = (): Errors => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please tell us your name.";
    if (!normalisePhone(phone)) next.phone = "Enter a 10-digit mobile number.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "That email doesn’t look right.";
    return next;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (["name", "phone", "email"] as const).find((k) => found[k]);
      if (first) formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const lines = [
      "Hello Rajat Caterers, I would like to enquire about catering.",
      "",
      `Name: ${name.trim()}`,
      `Phone: +91 ${normalisePhone(phone)}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      `Event: ${type}`,
      date ? `Date: ${formatDate(date)}` : "Date: not decided yet",
      `Guests: about ${guests}`,
      picked.length > 0 ? `Dishes of interest: ${picked.map((p) => p.name).join(", ")}` : null,
      notes.trim() ? `Notes: ${notes.trim()}` : null,
    ].filter((l): l is string => l !== null);

    const url = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(url);
    // The form collapses into the thank-you panel, so bring the section back into view.
    window.setTimeout(() => scrollToId("enquire"), 180);
  };

  const fieldBorder = (err?: string) => (err ? "border-[#e0675b]" : "border-white/25");

  return (
    <section id="enquire" data-dark className="relative z-10 overflow-hidden bg-navy px-6 pb-16 pt-28 text-paper md:px-14 md:pt-44">
      <Spotlight />
      <div className="relative mx-auto max-w-[1400px]">
        <FadeUp>
          <Eyebrow tone="dark">Ready to Celebrate?</Eyebrow>
        </FadeUp>
        <WordReveal
          as="h2"
          text="Compose your occasion."
          emphasis={["occasion."]}
          emphasisClassName="italic text-gold-soft"
          className="mt-6 font-display text-[clamp(3rem,9vw,8.5rem)] font-light leading-[0.9] tracking-tight"
        />
        <FadeUp delay={0.15}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-paper/80 md:text-lg">
            From intimate gatherings to grand feasts, Rajat Caterers brings 40 years of expertise to your table. Tell us about your event for bespoke NCR wedding catering or event solutions.
          </p>
        </FadeUp>

        <FadeUp delay={0.25} className="mt-12 flex flex-wrap gap-x-16 gap-y-8">
          <div>
            <p className="eyebrow text-gold">[ Call ]</p>
            <div className="mt-3 flex flex-col">
              {BRAND.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="inline-flex min-h-11 items-center font-display text-3xl font-light transition-colors duration-200 hover:text-gold-soft">
                  {p.display}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow text-gold">[ Visit ]</p>
            <address className="mt-3 text-[17px] not-italic leading-relaxed text-paper/85">
              {BRAND.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
          </div>
          <div>
            <p className="eyebrow text-gold">[ Online ]</p>
            <a href={BRAND.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-[17px] text-paper/85 underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold-soft">
              {BRAND.website}
            </a>
          </div>
        </FadeUp>

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-[1fr_360px] lg:gap-20">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                role="status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="border border-gold/40 p-8 md:p-12"
              >
                <p className="eyebrow text-gold">[ Message ready ]</p>
                <h3 className="mt-6 font-display text-4xl font-light md:text-6xl">
                  Thank you, <em className="text-gold-soft">{name.trim().split(" ")[0]}</em>.
                </h3>
                <p className="mt-6 max-w-lg text-paper/80">
                  WhatsApp should have opened with your enquiry filled in. Press send there and we will call you back. If it did not open, use the buttons below.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={sent} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 bg-gold px-7 text-[11px] font-semibold uppercase tracking-[0.26em] text-navy transition-[background-color,transform] duration-200 hover:bg-gold-soft active:scale-[0.97]">
                    <MessageCircle className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    Open WhatsApp
                  </a>
                  <a href={`tel:${BRAND.phones[0].tel}`} className="inline-flex min-h-12 items-center gap-3 border border-white/40 px-7 text-[11px] font-semibold uppercase tracking-[0.26em] transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-navy active:scale-[0.97]">
                    <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    Call {BRAND.phones[0].display}
                  </a>
                </div>
                <button type="button" onClick={() => setSent(null)} className="mt-8 text-sm text-paper/70 underline underline-offset-4 transition-colors hover:text-paper">
                  Edit my enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-14"
              >
                <div className="grid gap-14 md:grid-cols-2 md:gap-12">
                  <div>
                    <label htmlFor={`${uid}-name`} className="eyebrow text-gold">01. Your name</label>
                    <input id={`${uid}-name`} name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined} placeholder="Full name" className={`${inputBase} ${fieldBorder(errors.name)}`} />
                    {errors.name && <p id={`${uid}-name-err`} role="alert" className="mt-2 text-sm text-[#f0a49b]">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-phone`} className="eyebrow text-gold">02. Mobile number</label>
                    <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-phone-err` : undefined} placeholder="98XXX XXXXX" className={`${inputBase} ${fieldBorder(errors.phone)}`} />
                    {errors.phone && <p id={`${uid}-phone-err`} role="alert" className="mt-2 text-sm text-[#f0a49b]">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid gap-14 md:grid-cols-2 md:gap-12">
                  <div>
                    <label htmlFor={`${uid}-email`} className="eyebrow text-gold">03. Email <span className="text-paper/50">(optional)</span></label>
                    <input id={`${uid}-email`} name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}-email-err` : undefined} placeholder="you@example.com" className={`${inputBase} ${fieldBorder(errors.email)}`} />
                    {errors.email && <p id={`${uid}-email-err`} role="alert" className="mt-2 text-sm text-[#f0a49b]">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-date`} className="eyebrow text-gold">04. Event date <span className="text-paper/50">(if decided)</span></label>
                    <input id={`${uid}-date`} name="date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={`${inputBase} ${fieldBorder()}`} />
                  </div>
                </div>

                <fieldset>
                  <legend className="eyebrow text-gold">05. Type of event</legend>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {EVENT_TYPES.map((t) => (
                      <label key={t} className="cursor-pointer">
                        <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="peer sr-only" />
                        <span className="inline-flex min-h-12 items-center border border-white/30 px-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-paper/80 transition-[background-color,color,border-color,transform] duration-200 peer-checked:border-gold peer-checked:bg-gold peer-checked:text-navy peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold active:scale-[0.97] hover:border-gold">
                          {t}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor={`${uid}-guests`} className="eyebrow text-gold">06. Approximate guests</label>
                    <output htmlFor={`${uid}-guests`} className="font-display text-5xl font-light text-gold-soft md:text-6xl">
                      {guests >= 2000 ? "2,000+" : guests.toLocaleString("en-IN")}
                    </output>
                  </div>
                  <input id={`${uid}-guests`} type="range" min={50} max={2000} step={50} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="guest-range mt-4" />
                  <div className="mt-1 flex justify-between text-xs text-paper/50"><span>50</span><span>2,000+</span></div>
                </div>

                <div>
                  <label htmlFor={`${uid}-notes`} className="eyebrow text-gold">07. Anything else? <span className="text-paper/50">(optional)</span></label>
                  <textarea id={`${uid}-notes`} name="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Venue, cuisine preferences, dietary needs…" className={`${inputBase} resize-none ${fieldBorder()}`} />
                </div>

                {picked.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="eyebrow text-gold">[ Dishes you picked · {picked.length} ]</p>
                      <button type="button" onClick={clear} className="min-h-11 text-sm text-paper/70 underline underline-offset-4 transition-colors hover:text-paper">Clear all</button>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      <AnimatePresence initial={false}>
                        {picked.map((p) => (
                          <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} className="flex items-center gap-1 border border-gold/50 py-1 pl-4 pr-1 text-sm text-gold-soft">
                            {p.name}
                            <button type="button" onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="flex size-9 items-center justify-center text-gold-soft transition-transform duration-150 hover:text-white active:scale-90">
                              <X className="size-4" strokeWidth={1.75} />
                            </button>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>
                )}

                <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
                  <Magnetic>
                    <button type="submit" className="group inline-flex min-h-14 items-center gap-3 bg-gold px-9 text-[12px] font-semibold uppercase tracking-[0.26em] text-navy transition-[background-color,transform] duration-200 hover:bg-gold-soft active:scale-[0.97]">
                    <MessageCircle className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    Send enquiry on WhatsApp
                  </button>
                  </Magnetic>
                  <p className="max-w-xs text-sm text-paper/65">Opens WhatsApp with your details filled in. Nothing is sent until you press send there.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <aside aria-label="Summary of your enquiry" className="lg:sticky lg:top-24 lg:self-start">
            <OccasionCard name={name} type={type} date={date} guests={guests} picked={picked} sent={sent !== null} />
          </aside>
        </div>
      </div>
    </section>
  );
}
