import { createFileRoute } from "@tanstack/react-router";

import { publicSupabase } from "@/lib/public-supabase";

const SAFE_PATH = /^[A-Za-z0-9/_.-]{1,200}$/;

/** Serves article cover images from the private article-covers bucket. */
export const Route = createFileRoute("/api/public/capas/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!SAFE_PATH.test(path) || path.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        const { data, error } = await publicSupabase().storage.from("article-covers").download(path);
        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }
        return new Response(data, {
          headers: {
            "Content-Type": data.type || "application/octet-stream",
            "Cache-Control": "public, max-age=86400",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
