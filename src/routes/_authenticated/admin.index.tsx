import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/components/site/articles";
import { buttonClass } from "@/components/site/booking";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminArticlesPage,
});

function AdminArticlesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, category, status, updated_at, published_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container-site max-w-5xl py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-navy">Artigos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Crie, edite e publique os textos do blog.</p>
        </div>
        <Link to="/admin/novo" className={buttonClass("primary")}>
          <Plus className="size-4" /> Novo artigo
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-paper">
        {isLoading ? (
          <div className="flex justify-center p-10"><Loader2 className="size-6 animate-spin text-sage" /></div>
        ) : error ? (
          <p className="p-8 text-sm text-destructive">Não foi possível carregar os artigos.</p>
        ) : !data?.length ? (
          <p className="p-8 text-center text-muted-foreground">Nenhum artigo ainda. Clique em “Novo artigo” para começar.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((a) => (
              <li key={a.id}>
                <Link
                  to="/admin/$id"
                  params={{ id: a.id }}
                  className="flex flex-col gap-2 p-5 transition-colors hover:bg-sand-soft/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg font-semibold text-navy">{a.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {a.category} · atualizado em {formatDate(a.updated_at)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "self-start rounded-full px-3 py-1 text-xs font-semibold sm:self-center",
                      a.status === "published" ? "bg-sage-soft text-navy" : "bg-sand-soft text-navy",
                    )}
                  >
                    {a.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
