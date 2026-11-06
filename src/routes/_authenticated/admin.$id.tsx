import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  component: EditArticlePage,
});

function EditArticlePage() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-articles", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="flex justify-center p-16"><Loader2 className="size-6 animate-spin text-sage" /></div>;
  }
  if (!data) {
    return (
      <div className="container-site py-16 text-center">
        <p className="text-muted-foreground">Artigo não encontrado.</p>
        <Link to="/admin" className="mt-4 inline-block text-navy underline">Voltar</Link>
      </div>
    );
  }
  return <ArticleEditor key={data.id} article={data} />;
}
