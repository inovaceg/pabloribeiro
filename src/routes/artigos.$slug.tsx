import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock } from "lucide-react";

import { site, SITE_URL } from "@/config/site";
import { BOOKING_MESSAGES } from "@/lib/contact";
import { publishedArticleQuery, publishedArticlesQuery } from "@/lib/articles.queries";
import { absoluteUrl, pageHead } from "@/lib/seo";
import { ArticleBody, ArticleCard, formatDate } from "@/components/site/articles";
import { BookingButton } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow } from "@/components/site/primitives";

export const Route = createFileRoute("/artigos/$slug")({
  loader: async ({ params, context }) => {
    const [article] = await Promise.all([
      context.queryClient.ensureQueryData(publishedArticleQuery(params.slug)),
      context.queryClient.ensureQueryData(publishedArticlesQuery()),
    ]);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    const article = loaderData?.article;
    if (!article) {
      return { meta: [{ title: "Artigo indisponível | Pablo Ribeiro" }, { name: "robots", content: "noindex" }] };
    }
    const path = `/artigos/${params.slug}`;
    const image = article.coverUrl ? `${SITE_URL}${article.coverUrl}` : undefined;
    const base = pageHead({
      title: `${article.title} | Pablo Ribeiro, Psicólogo`,
      description: article.description,
      path,
      ...(image ? { image } : {}),
    });
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
            datePublished: article.publishedAt,
            inLanguage: "pt-BR",
            mainEntityOfPage: absoluteUrl(path),
            ...(image ? { image } : {}),
            author: { "@type": "Person", name: site.name, jobTitle: `${site.role} · ${site.crp}`, url: SITE_URL },
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: article } = useSuspenseQuery(publishedArticleQuery(slug));
  const { data: all } = useSuspenseQuery(publishedArticlesQuery());
  if (!article) return null;
  const others = all.filter((a) => a.slug !== article.slug).slice(0, 2);
  const message = article.category.includes("Avaliação") ? BOOKING_MESSAGES.avaliacao : BOOKING_MESSAGES.psicoterapia;

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
          {article.description && <p className="mt-6 text-lg leading-relaxed text-ivory/75">{article.description}</p>}
          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ivory/70">
            <span className="font-semibold text-ivory">{site.name}</span>
            <span>
              {site.role} · {site.crp}
            </span>
            <span aria-hidden className="text-sand">|</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden /> {article.readingMinutes} min
            </span>
          </p>
        </div>
      </section>

      <article className="py-14 sm:py-20">
        <div className="container-site max-w-3xl">
          {article.coverUrl && (
            <img
              src={article.coverUrl}
              alt={article.coverAlt}
              className="mb-12 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          )}
          <ArticleBody body={article.body} />

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

      {others.length > 0 && (
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
      )}
    </>
  );
}
