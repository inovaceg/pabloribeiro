import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, ShieldAlert } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { buttonClass } from "@/components/site/booking";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
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

  if (!isAdmin) {
    return (
      <section className="flex min-h-[80vh] items-center bg-ivory px-4 pt-28 pb-16">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-paper p-8 text-center sm:p-10">
          <ShieldAlert className="mx-auto size-8 text-sand" aria-hidden />
          <h1 className="mt-5 text-2xl text-navy">Sem permissão</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            A conta {user.email} não tem acesso à área administrativa.
          </p>
          <button type="button" onClick={signOut} className={buttonClass("outline", "mt-7")}>
            Sair
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-[85vh] bg-ivory pt-[76px] sm:pt-20">
      <div className="border-b border-border bg-paper">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-5">
            <Link to="/admin" className="font-display text-xl font-semibold text-navy">
              Administração
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
          </div>
          <button type="button" onClick={signOut} className="inline-flex items-center gap-2 text-sm text-navy hover:underline">
            <LogOut className="size-4" /> Sair
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
