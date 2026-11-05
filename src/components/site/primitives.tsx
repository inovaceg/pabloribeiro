import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";

import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-sage", className)}>
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  tone = "default",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  tone?: "default" | "inverse";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center [&_.eyebrow]:justify-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow className={tone === "inverse" ? "text-sand" : ""}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "mt-5 text-3xl leading-[1.12] sm:text-4xl lg:text-[2.85rem]",
          tone === "inverse" ? "text-ivory" : "text-navy",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tone === "inverse" ? "text-ivory/75" : "text-muted-foreground",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

/** Interior page header: dark editorial band with texture. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pt-32 pb-16 text-ivory sm:pt-44 sm:pb-24">
      <div aria-hidden className="grain-layer absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-12%] -z-10 size-[30rem] rounded-full bg-sage/25 blur-3xl sm:size-[38rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] -bottom-48 -z-10 hidden size-[26rem] rounded-full border border-sand/25 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[14%] -bottom-28 -z-10 hidden size-[16rem] rounded-full border border-ivory/10 md:block"
      />
      <div className="container-site relative">
        <Reveal>
          <Eyebrow className="text-sand">{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-[2.5rem] leading-[1.05] text-ivory sm:text-6xl lg:text-7xl [&_em]:text-sage">
            {title}
          </h1>
          {intro && (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ivory/75">{intro}</p>
          )}
          {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
          <p className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-ivory/20 px-4 py-2 text-xs tracking-wide text-ivory/80">
            <BadgeCheck className="size-4 text-sand" aria-hidden />
            {site.name} · {site.role} · <span className="font-semibold text-ivory">{site.crp}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function NumberedItem({
  index,
  title,
  children,
  tone = "default",
}: {
  index: number;
  title: ReactNode;
  children: ReactNode;
  tone?: "default" | "inverse";
}) {
  return (
    <div
      className={cn(
        "border-t pt-6",
        tone === "inverse" ? "border-ivory/15" : "border-navy/15",
      )}
    >
      <span className="font-display text-sm text-sand italic">
        {String(index).padStart(2, "0")}
      </span>
      <h3
        className={cn(
          "mt-3 text-xl leading-snug sm:text-2xl",
          tone === "inverse" ? "text-ivory" : "text-navy",
        )}
      >
        {title}
      </h3>
      <div
        className={cn(
          "mt-3 leading-relaxed",
          tone === "inverse" ? "text-ivory/70" : "text-muted-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
