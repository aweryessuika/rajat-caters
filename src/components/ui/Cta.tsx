"use client";

import type { ReactNode, MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { scrollToId } from "@/lib/scroll";
import RollText from "@/components/ui/RollText";

type Variant = "gold" | "outline-light" | "outline-ink";

const VARIANTS: Record<Variant, string> = {
  gold: "bg-gold text-navy hover:bg-gold-soft border border-gold",
  "outline-light": "border border-white/40 text-white hover:bg-white hover:text-navy",
  "outline-ink": "border border-ink/30 text-ink hover:bg-ink hover:text-paper",
};

type CtaProps = {
  href: string;
  /** Plain-text labels roll letter by letter on hover. */
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
};

export default function Cta({ href, children, variant = "gold", className = "", external = false }: CtaProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollToId(href.slice(1));
    }
  };
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex min-h-12 items-center gap-3 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] transition-[background-color,color,transform,border-color] duration-200 ease-out active:scale-[0.97] ${VARIANTS[variant]} ${className}`}
    >
      {typeof children === "string" ? <RollText text={children} /> : <span>{children}</span>}
      {/* The arrow flies out to the top right while a fresh one arrives from the bottom left. */}
      <span aria-hidden="true" className="relative size-4 overflow-hidden">
        <ArrowUpRight className="absolute inset-0 size-4 transition-transform duration-[420ms] ease-out-expo group-hover:-translate-y-full group-hover:translate-x-full" strokeWidth={1.75} />
        <ArrowUpRight className="absolute inset-0 size-4 -translate-x-full translate-y-full transition-transform duration-[420ms] ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" strokeWidth={1.75} />
      </span>
    </a>
  );
}
