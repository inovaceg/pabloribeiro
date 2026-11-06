import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, LogOut, ShieldAlert } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { buttonClass } from "@/components/site/booking";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    // UX gate only — the database RLS policies are the real protection.
    const { data, error } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    return { isAdmin: !error && data === true };
  },
  head: () => ({
    meta: [
      { title: "Administração | Pablo Ribeiro" },
      { name: "description", content: "Gerenciamento dos artigos do site." },
      { property: "og:title", content: "Administração | Pablo Ribeiro" },
      { property: "og:description", content: "Gerenciamento dos artigos do site." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
}

function AdminLayout() {
  const { isAdmin, user } = Route.useRouteContext();
  const signOut = useSignOut();

  return (
    <div className="min-h-screen bg-ivory">
      <header className="relative isolate overflow-hidden bg-navy text-ivory">
        <div aria-hidden className="grain-layer absolute inset-0 -z-10" />
        <div className="container-site flex items-center justify-between gap-4 py-4">
          <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-3" aria-label="Painel de artigos">
            <span aria-hidden className="font-display text-[1.9rem] leading-none tracking-[-0.14em] text-sand">PR</span>
            <span aria-hidden className="h-8 w-px bg-sand/50" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-base tracking-[0.04em] text-sand">Painel</span>
              <span className="mt-1 text-[0.62rem] font-semibold tracking-[0.16em] text-ivory/70">ARTIGOS DO SITE</span>
            </span>
          </Link>
          <nav aria-label="Conta" className="flex items-center gap-1 text-sm sm:gap-2">
            <span className="mr-2 hidden max-w-[16rem] truncate text-ivory/60 md:inline">{user.email}</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-ivory/80 transition-colors hover:bg-ivory/10 hover:text-ivory"
            >
              <ExternalLink className="size-4" aria-hidden />
              <span className="hidden sm:inline">Ver site</span>
              <span className="sr-only sm:hidden">Ver site (abre em nova aba)</span>
            </a>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-ivory/80 transition-colors hover:bg-ivory/10 hover:text-ivory"
            >
              <LogOut className="size-4" aria-hidden />
              <span className="hidden sm:inline">Sair</span>
              <span className="sr-only sm:hidden">Sair</span>
            </button>
          </nav>
        </div>
      </header>

      {isAdmin ? (
        <Outlet />
      ) : (
        <section className="flex min-h-[70vh] items-center px-4 py-16">
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-paper p-8 text-center shadow-soft sm:p-10">
            <ShieldAlert className="mx-auto size-8 text-sand" aria-hidden />
            <h1 className="mt-5 text-2xl text-navy">Acesso negado</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              A conta <strong className="text-navy">{user.email}</strong> não tem permissão para acessar a área administrativa.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={signOut} className={buttonClass("primary")}>
                Entrar com outra conta
              </button>
              <Link to="/" className={buttonClass("outline")}>
                Voltar ao site
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
