import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";

import type { Article } from "@/content/articles";
import { Reveal } from "./Reveal";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "2026-11-05" → "5 nov 2026" (no locale APIs, so SSR and browser match). */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <Reveal delay={index * 90} className="h-full">
      <Link
        to="/artigos/$slug"
        params={{ slug: article.slug }}
        className="group flex h-full flex-col rounded-2xl border border-border bg-paper p-7 transition-all duration-500 ease-elegant hover:-translate-y-1 hover:border-sage/60 hover:shadow-soft"
      >
        <span className="eyebrow text-sage">{article.category}</span>
        <h3 className="mt-4 font-display text-2xl leading-snug font-semibold text-navy">{article.title}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{article.description}</p>
        <span className="mt-6 flex items-center justify-between gap-4 border-t border-navy/10 pt-5 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-4" aria-hidden /> {article.readingMinutes} min de leitura
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-navy">
            Ler
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
    </Reveal>
  );
}
