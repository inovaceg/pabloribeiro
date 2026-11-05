import { createFileRoute } from "@tanstack/react-router";

import { ARTICLES } from "@/content/articles";
import { pageHead } from "@/lib/seo";
import { ArticleCard } from "@/components/site/articles";
import { PageHero } from "@/components/site/primitives";
import { CtaBand } from "@/components/site/sections";

export const Route = createFileRoute("/artigos/")({
  head: () =>
    pageHead({
      title: "Artigos sobre saúde mental, TCC e Avaliação Neuropsicológica | Pablo Ribeiro",
      description:
        "Textos curtos e acessíveis sobre psicoterapia, Terapia Cognitivo-Comportamental, ansiedade e Avaliação Neuropsicológica, por Pablo Ribeiro, psicólogo em Juiz de Fora.",
      path: "/artigos",
    }),
  component: ArticlesPage,
});

function ArticlesPage() {
  return (
    <>
      <PageHero
        eyebrow="Artigos"
        title={
          <>
            Conteúdo para <em className="font-light italic">compreender e cuidar.</em>
          </>
        }
        intro="Textos curtos e acessíveis sobre saúde mental, psicoterapia e avaliação neuropsicológica. São informativos e não substituem o acompanhamento profissional."
      />
      <section className="py-16 sm:py-24">
        <div className="container-site grid gap-5 md:grid-cols-2">
          {ARTICLES.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
