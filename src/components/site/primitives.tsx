import type { ReactNode } from "react";
import { PencilLine } from "lucide-react";

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

/** Interior page header with editorial title. */
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
    <section className="relative overflow-hidden border-b border-border/70 pt-36 pb-16 sm:pt-44 sm:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[34rem] rounded-full bg-sage-soft/70 blur-3xl"
      />
      <div className="container-site relative">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-[2.6rem] leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
          )}
          {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}

/** Marks content still to be supplied by the professional. */
export function PendingField({
  label,
  hint,
  className,
  tone = "default",
}: {
  label: string;
  hint?: string;
  className?: string;
  tone?: "default" | "inverse";
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border border-dashed px-4 py-3.5 text-sm",
        tone === "inverse"
          ? "border-ivory/25 text-ivory/70"
          : "border-sand/70 bg-paper/50 text-muted-foreground",
        className,
      )}
    >
      <PencilLine className="mt-0.5 size-4 shrink-0 text-sand" aria-hidden />
      <div>
        <p className={cn("font-medium", tone === "inverse" ? "text-ivory" : "text-navy")}>
          {label}
        </p>
        <p className="mt-0.5 leading-relaxed">
          {hint ?? "Informação em atualização. Para detalhes, entre em contato."}
        </p>
      </div>
    </div>
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
