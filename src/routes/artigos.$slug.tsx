import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";

import { site, SITE_URL } from "@/config/site";
import { ARTICLES, getArticle } from "@/content/articles";
import { BOOKING_MESSAGES } from "@/lib/contact";
import { absoluteUrl, pageHead } from "@/lib/seo";
import { ArticleCard, formatDate } from "@/components/site/articles";
import { BookingButton } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow } from "@/components/site/primitives";

export const Route = createFileRoute("/artigos/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    const article = loaderData?.article;
    if (!article) return { meta: [{ title: "Artigo não encontrado | Pablo Ribeiro" }] };
    const path = `/artigos/${params.slug}`;
    const base = pageHead({ title: `${article.title} | Pablo Ribeiro, Psicólogo`, description: article.description, path });
    return {
      ...base,
      meta: base.meta.map((m) => (m["property"] === "og:type" ? { property: "og:type", content: "article" } : m)),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            datePublished: article.published,
            inLanguage: "pt-BR",
            mainEntityOfPage: absoluteUrl(path),
            author: { "@type": "Person", name: site.name, jobTitle: `${site.role} · ${site.crp}`, url: SITE_URL },
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const others = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);
  const message = article.related === "avaliacao" ? BOOKING_MESSAGES.avaliacao : BOOKING_MESSAGES.psicoterapia;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy pt-32 pb-14 text-ivory sm:pt-40 sm:pb-20">
        <div aria-hidden className="grain-layer absolute inset-0 -z-10" />
        <div aria-hidden className="pointer-events-none absolute -top-32 right-[-12%] -z-10 size-[30rem] rounded-full bg-sage/25 blur-3xl" />
        <div className="container-site max-w-3xl">
          <Link to="/artigos" className="inline-flex items-center gap-2 text-sm text-ivory/75 transition-colors hover:text-ivory">
            <ArrowLeft className="size-4" /> Todos os artigos
          </Link>
          <Eyebrow className="mt-8 text-sand">{article.category}</Eyebrow>
          <h1 className="mt-5 text-[2.2rem] leading-[1.08] text-ivory sm:text-5xl">{article.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ivory/75">{article.description}</p>
          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ivory/70">
            <span className="font-semibold text-ivory">{site.name}</span>
            <span>{site.role} · {site.crp}</span>
            <span aria-hidden className="text-sand">|</span>
            <span>{formatDate(article.published)}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden /> {article.readingMinutes} min
            </span>
          </p>
        </div>
      </section>

      <article className="py-14 sm:py-20">
        <div className="container-site max-w-3xl">
          <div className="space-y-6 text-[1.075rem] leading-[1.8] text-navy/85">
            {article.body.map((block, i) => {
              if (block.type === "h2")
                return (
                  <h2 key={i} className="pt-6 text-2xl leading-snug text-navy sm:text-[1.9rem]">
                    {block.text}
                  </h2>
                );
              if (block.type === "list")
                return (
                  <ul key={i} className="space-y-3">
                    {block.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span aria-hidden className="mt-[0.85rem] h-[3px] w-4 shrink-0 rounded-full bg-sand" />
                        {it}
                      </li>
                    ))}
                  </ul>
                );
              return <p key={i}>{block.text}</p>;
            })}
          </div>

          <Reveal className="mt-14 rounded-2xl bg-sage-soft/70 p-7 sm:p-9">
            <p className="font-display text-2xl leading-snug text-navy">Quer conversar sobre isso?</p>
            <p className="mt-3 leading-relaxed text-navy/75">
              Atendimento presencial em {site.city} – {site.state} e online. Tire suas dúvidas pelo WhatsApp.
            </p>
            <BookingButton variant="whatsapp" message={message} className="mt-6">
              Falar no WhatsApp
            </BookingButton>
          </Reveal>
        </div>
      </article>

      <section className="border-t border-border/70 bg-paper py-16 sm:py-20">
        <div className="container-site">
          <h2 className="text-3xl text-navy">Continue lendo</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {others.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
