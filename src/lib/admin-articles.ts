import { queryOptions, type QueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { ArticleStatus } from "./article-form";

/**
 * Admin-only article data access. Runs in the browser with the signed-in session,
 * so every read/write is enforced by the articles RLS policies (admin role required
 * for drafts and for any insert/update/delete).
 */

export type AdminArticle = Database["public"]["Tables"]["articles"]["Row"];

export const COVER_BUCKET = "article-covers";

export const adminArticlesQuery = () =>
  queryOptions({
    queryKey: ["admin-articles", "list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, category, status, cover_path, cover_alt, created_at, updated_at, published_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const adminArticleQuery = (id: string) =>
  queryOptions({
    queryKey: ["admin-articles", "detail", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

/** Refresh admin lists and the public article pages/teasers after any change. */
export async function invalidateArticleQueries(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["admin-articles"] }),
    queryClient.invalidateQueries({ queryKey: ["articles"] }),
  ]);
}

/** True when another article already uses this slug. */
export async function isSlugTaken(slug: string, exceptId?: string) {
  let q = supabase.from("articles").select("id").eq("slug", slug).limit(1);
  if (exceptId) q = q.neq("id", exceptId);
  const { data, error } = await q;
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export async function setArticleStatus(id: string, status: ArticleStatus) {
  const { error } = await supabase.from("articles").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteArticle(article: Pick<AdminArticle, "id" | "cover_path">) {
  const { error } = await supabase.from("articles").delete().eq("id", article.id);
  if (error) throw error;
  if (article.cover_path) {
    // Best effort: the article is already gone, an orphan file is harmless.
    await supabase.storage.from(COVER_BUCKET).remove([article.cover_path]);
  }
}

export function friendlyError(error: unknown, fallback: string) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code === "23505") return "Já existe um artigo com este endereço (link).";
  if (code === "42501" || code === "PGRST301") return "Sua sessão não tem permissão para esta ação. Entre novamente.";
  return fallback;
}
