import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";
import { coverUrlFor, readingMinutes } from "./article-body";

export type PublicArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  body: string;
  coverUrl: string | null;
  coverAlt: string;
  publishedAt: string;
  readingMinutes: number;
};

/** Read-only client with the publishable key: RLS only exposes published articles. */
function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Backend is not configured");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const COLUMNS = "slug, title, description, category, body, cover_path, cover_alt, published_at";

type Row = Pick<
  Database["public"]["Tables"]["articles"]["Row"],
  "slug" | "title" | "description" | "category" | "body" | "cover_path" | "cover_alt" | "published_at"
>;

function toPublic(r: Row): PublicArticle {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    category: r.category,
    body: r.body,
    coverUrl: coverUrlFor(r.cover_path),
    coverAlt: r.cover_alt,
    publishedAt: r.published_at ?? new Date().toISOString(),
    readingMinutes: readingMinutes(r.body),
  };
}

export const listPublishedArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("articles")
    .select(COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("listPublishedArticles failed", error);
    return [] as PublicArticle[];
  }
  return (data ?? []).map(toPublic);
});

export const getPublishedArticle = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("articles")
      .select(COLUMNS)
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) console.error("getPublishedArticle failed", error);
    return row ? toPublic(row) : null;
  });
