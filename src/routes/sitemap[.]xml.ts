import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/config/site";
import { publicSupabase } from "@/lib/public-supabase";

const STATIC_PAGES: Array<[path: string, priority: string]> = [
  ["/", "1.0"],
  ["/sobre", "0.8"],
  ["/psicoterapia", "0.9"],
  ["/avaliacao-neuropsicologica", "0.9"],
  ["/atendimento", "0.8"],
  ["/artigos", "0.7"],
  ["/perguntas-frequentes", "0.6"],
  ["/contato", "0.8"],
  ["/politica-de-privacidade", "0.3"],
];

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let articles: Array<{ slug: string; updated_at: string }> = [];
        try {
          const { data } = await publicSupabase()
            .from("articles")
            .select("slug, updated_at")
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(1000);
          articles = data ?? [];
        } catch (e) {
          console.error("sitemap: could not load articles", e);
        }

        const urls = [
          ...STATIC_PAGES.map(([p, priority]) => `  <url><loc>${SITE_URL}${p}</loc><priority>${priority}</priority></url>`),
          ...articles.map(
            (a) =>
              `  <url><loc>${SITE_URL}/artigos/${escapeXml(a.slug)}</loc><lastmod>${a.updated_at.slice(0, 10)}</lastmod><priority>0.6</priority></url>`,
          ),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
