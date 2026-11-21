"use client";

import type { ReactNode, MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

type Variant = "gold" | "outline-light" | "outline-ink";

const VARIANTS: Record<Variant, string> = {
  gold: "bg-gold text-navy hover:bg-gold-soft border border-gold",
  "outline-light": "border border-white/40 text-white hover:bg-white hover:text-navy",
  "outline-ink": "border border-ink/30 text-ink hover:bg-ink hover:text-paper",
};

type CtaProps = {
  href: string;
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
      <span>{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.75}
      />
    </a>
  );
}
