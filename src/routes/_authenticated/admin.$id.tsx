import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { adminArticleQuery } from "@/lib/admin-articles";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  head: () => ({
    meta: [
      { title: "Editar artigo | Administração · Pablo Ribeiro" },
      { name: "description", content: "Edição de artigo do site." },
      { property: "og:title", content: "Editar artigo | Administração · Pablo Ribeiro" },
      { property: "og:description", content: "Edição de artigo do site." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EditArticlePage,
});

function EditArticlePage() {
  const { id } = Route.useParams();
  const { data, isLoading, error, refetch } = useQuery(adminArticleQuery(id));

  if (isLoading) {
    return (
      <div className="flex justify-center p-16" role="status" aria-label="Carregando artigo">
        <Loader2 className="size-6 animate-spin text-sage" aria-hidden />
      </div>
    );
  }
  if (error) {
    return (
      <div className="container-site py-16 text-center">
        <p className="text-destructive">Não foi possível carregar o artigo.</p>
        <button type="button" onClick={() => refetch()} className="mt-4 text-navy underline">
          Tentar novamente
        </button>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="container-site py-16 text-center">
        <p className="text-muted-foreground">Artigo não encontrado. Ele pode ter sido excluído.</p>
        <Link to="/admin" className="mt-4 inline-block text-navy underline">
          Voltar para a lista
        </Link>
      </div>
    );
  }
  return <ArticleEditor key={data.id} article={data} />;
}
