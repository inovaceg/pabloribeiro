import { createFileRoute } from "@tanstack/react-router";

import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const Route = createFileRoute("/_authenticated/admin/novo")({
  head: () => ({
    meta: [
      { title: "Novo artigo | Administração · Pablo Ribeiro" },
      { name: "description", content: "Criação de novo artigo do site." },
      { property: "og:title", content: "Novo artigo | Administração · Pablo Ribeiro" },
      { property: "og:description", content: "Criação de novo artigo do site." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NewArticlePage,
});

function NewArticlePage() {
  return <ArticleEditor />;
}
