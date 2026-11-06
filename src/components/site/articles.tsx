import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";

import { parseArticleBody } from "@/lib/article-body";
import type { PublicArticle } from "@/lib/articles.functions";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** ISO date → "5 nov 2026" (no locale APIs, so SSR and browser match). */
export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

export function ArticleCard({ article, index = 0 }: { article: PublicArticle; index?: number }) {
  return (
    <Reveal delay={index * 90} className="h-full">
      <Link
        to="/artigos/$slug"
        params={{ slug: article.slug }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-paper transition-all duration-500 ease-elegant hover:-translate-y-1 hover:border-sage/60 hover:shadow-soft"
      >
        {article.coverUrl && (
          <img
            src={article.coverUrl}
            alt={article.coverAlt}
            loading="lazy"
            className="aspect-[16/9] w-full object-cover"
          />
        )}
        <span className="flex flex-1 flex-col p-7">
          <span className="eyebrow text-sage">{article.category}</span>
          <span className="mt-4 font-display text-2xl leading-snug font-semibold text-navy">{article.title}</span>
          <span className="mt-3 flex-1 leading-relaxed text-muted-foreground">{article.description}</span>
          <span className="mt-6 flex items-center justify-between gap-4 border-t border-navy/10 pt-5 text-sm">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-4" aria-hidden /> {article.readingMinutes} min de leitura
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-navy">
              Ler
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </span>
        </span>
      </Link>
    </Reveal>
  );
}

/** Renders an article body written in the simple text format (## heading, - list). */
export function ArticleBody({ body, className }: { body: string; className?: string }) {
  return (
    <div className={cn("space-y-6 text-[1.075rem] leading-[1.8] text-navy/85", className)}>
      {parseArticleBody(body).map((block, i) => {
        if (block.type === "h2")
          return (
            <h2 key={i} className="pt-6 text-2xl leading-snug text-navy sm:text-[1.9rem]">
              {block.text}
            </h2>
          );
        if (block.type === "list")
          return (
            <ul key={i} className="space-y-3">
              {block.items.map((it, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden className="mt-[0.85rem] h-[3px] w-4 shrink-0 rounded-full bg-sand" />
                  {it}
                </li>
              ))}
            </ul>
          );
        return <p key={i}>{block.text}</p>;
      })}
    </div>
  );
}
