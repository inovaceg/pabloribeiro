import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  FileText,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { coverUrlFor } from "@/lib/article-body";
import { validateArticleForm } from "@/lib/article-form";
import {
  adminArticlesQuery,
  deleteArticle,
  friendlyError,
  invalidateArticleQueries,
  setArticleStatus,
} from "@/lib/admin-articles";
import { cn } from "@/lib/utils";
import { formatDate } from "@/components/site/articles";
import { buttonClass } from "@/components/site/booking";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StatusFilter = "all" | "published" | "draft";

export const Route = createFileRoute("/_authenticated/admin/")({
  validateSearch: (search: Record<string, unknown>): { q?: string; status?: StatusFilter } => {
    const q = typeof search["q"] === "string" ? search["q"].slice(0, 100) : undefined;
    const s = search["status"];
    const status = s === "published" || s === "draft" ? s : undefined;
    return { ...(q ? { q } : {}), ...(status ? { status } : {}) };
  },
  head: () => ({
    meta: [
      { title: "Artigos | Administração · Pablo Ribeiro" },
      { name: "description", content: "Lista e gerenciamento dos artigos do site." },
      { property: "og:title", content: "Artigos | Administração · Pablo Ribeiro" },
      { property: "og:description", content: "Lista e gerenciamento dos artigos do site." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type Row = NonNullable<ReturnType<typeof useArticles>["data"]>[number];

function useArticles() {
  return useQuery(adminArticlesQuery());
}

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function AdminDashboard() {
  const { q = "", status = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch, isFetching } = useArticles();
  const [toDelete, setToDelete] = useState<Row | null>(null);

  const setSearch = (next: { q?: string; status?: StatusFilter }) =>
    navigate({
      to: ".",
      replace: true,
      search: (prev) => {
        const merged = { ...prev, ...next };
        return {
          ...(merged.q ? { q: merged.q } : {}),
          ...(merged.status && merged.status !== "all" ? { status: merged.status } : {}),
        };
      },
    });

  const statusMutation = useMutation({
    mutationFn: async ({ row, next }: { row: Row; next: "draft" | "published" }) => {
      if (next === "published") {
        const { data: full, error: e } = await supabase.from("articles").select("*").eq("id", row.id).single();
        if (e) throw e;
        const check = validateArticleForm(
          { title: full.title, slug: full.slug, category: full.category, description: full.description, body: full.body, cover_alt: full.cover_alt },
          "published",
          Boolean(full.cover_path),
        );
        if (!check.ok) return { incomplete: true as const };
      }
      await setArticleStatus(row.id, next);
      return { incomplete: false as const };
    },
    onSuccess: async (res, { row, next }) => {
      if (res.incomplete) {
        toast.error("Complete o resumo, o texto e a descrição da capa antes de publicar.");
        navigate({ to: "/admin/$id", params: { id: row.id } });
        return;
      }
      await invalidateArticleQueries(queryClient);
      toast.success(next === "published" ? `“${row.title}” foi publicado.` : `“${row.title}” voltou para rascunho.`);
    },
    onError: (err) => toast.error(friendlyError(err, "Não foi possível alterar o status.")),
  });

  const deleteMutation = useMutation({
    mutationFn: (row: Row) => deleteArticle(row),
    onSuccess: async (_d, row) => {
      await invalidateArticleQueries(queryClient);
      toast.success(`“${row.title}” foi excluído.`);
    },
    onError: (err) => toast.error(friendlyError(err, "Não foi possível excluir o artigo.")),
    onSettled: () => setToDelete(null),
  });

  const all = data ?? [];
  const published = all.filter((a) => a.status === "published").length;
  const drafts = all.length - published;
  const term = normalize(q.trim());
  const rows = all.filter(
    (a) => (status === "all" || a.status === status) && (!term || normalize(a.title).includes(term)),
  );

  const pendingId = statusMutation.isPending ? statusMutation.variables?.row.id : undefined;

  return (
    <div className="container-site max-w-6xl py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-sage">Blog</p>
          <h1 className="mt-2 text-3xl text-navy sm:text-4xl">Artigos</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Escreva, revise e publique os textos que aparecem no site.</p>
        </div>
        <Link to="/admin/novo" className={buttonClass("primary", "py-3")}>
          <Plus className="size-4" aria-hidden /> Novo artigo
        </Link>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-5">
        <Stat label="Publicados" value={published} loading={isLoading} tone="dark" onClick={() => setSearch({ status: "published" })} active={status === "published"} />
        <Stat label="Rascunhos" value={drafts} loading={isLoading} onClick={() => setSearch({ status: "draft" })} active={status === "draft"} />
        <Stat label="Total" value={all.length} loading={isLoading} onClick={() => setSearch({ status: "all" })} active={status === "all"} />
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setSearch({ q: e.target.value })}
            placeholder="Buscar por título"
            aria-label="Buscar artigos por título"
            className="w-full rounded-full border border-input bg-paper py-2.5 pr-4 pl-10 text-sm text-navy placeholder:text-muted-foreground/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
          />
        </div>
        <div role="group" aria-label="Filtrar por status" className="flex self-start rounded-full border border-border bg-paper p-1 text-sm sm:self-auto">
          {(
            [
              ["all", "Todos"],
              ["published", "Publicados"],
              ["draft", "Rascunhos"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => setSearch({ status: value })}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                status === value ? "bg-navy text-ivory" : "text-navy hover:bg-sand-soft/50",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-paper">
        {isLoading ? (
          <ul aria-label="Carregando artigos" className="divide-y divide-border">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-4 p-5">
                <span className="hidden h-12 w-20 animate-pulse rounded-md bg-sand-soft sm:block" />
                <span className="flex-1 space-y-2">
                  <span className="block h-4 w-2/3 animate-pulse rounded bg-sand-soft" />
                  <span className="block h-3 w-1/3 animate-pulse rounded bg-sand-soft/70" />
                </span>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-destructive">Não foi possível carregar os artigos.</p>
            <button type="button" onClick={() => refetch()} className="mt-3 text-sm text-navy underline underline-offset-4">
              {isFetching ? "Tentando…" : "Tentar novamente"}
            </button>
          </div>
        ) : all.length === 0 ? (
          <div className="flex flex-col items-center p-12 text-center">
            <FileText className="size-8 text-sand" aria-hidden />
            <p className="mt-4 font-display text-xl text-navy">Nenhum artigo ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">Comece escrevendo o primeiro texto do blog.</p>
            <Link to="/admin/novo" className={buttonClass("primary", "mt-6 py-3")}>
              <Plus className="size-4" aria-hidden /> Novo artigo
            </Link>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-muted-foreground">Nenhum artigo encontrado com esses filtros.</p>
            <button type="button" onClick={() => setSearch({ q: "", status: "all" })} className="mt-3 text-sm text-navy underline underline-offset-4">
              Limpar filtros
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Lista de artigos</caption>
            <thead className="hidden border-b border-border bg-sand-soft/30 text-xs tracking-wide text-muted-foreground uppercase md:table-header-group">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Artigo</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Data</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((a) => {
                const cover = coverUrlFor(a.cover_path);
                const isPub = a.status === "published";
                return (
                  <tr key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4 transition-colors hover:bg-sand-soft/20 md:table-row md:p-0">
                    <td className="w-full min-w-0 md:w-auto md:px-5 md:py-4">
                      <Link to="/admin/$id" params={{ id: a.id }} className="group flex items-center gap-4">
                        {cover ? (
                          <img src={cover} alt="" loading="lazy" className="h-12 w-20 shrink-0 rounded-md object-cover" />
                        ) : (
                          <span aria-hidden className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md bg-sand-soft/60">
                            <FileText className="size-5 text-sand" />
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="line-clamp-2 font-display text-base leading-snug font-semibold text-navy group-hover:underline group-hover:underline-offset-4">
                            {a.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{a.category}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="md:px-5 md:py-4">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="text-xs text-muted-foreground md:px-5 md:py-4 md:text-sm">
                      {isPub && a.published_at ? (
                        <>Publicado em {formatDate(a.published_at)}</>
                      ) : (
                        <>Editado em {formatDate(a.updated_at)}</>
                      )}
                    </td>
                    <td className="ml-auto md:px-5 md:py-4 md:text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to="/admin/$id"
                          params={{ id: a.id }}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-navy hover:bg-sand-soft/60"
                        >
                          <Pencil className="size-4" aria-hidden /> <span>Editar</span>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label={`Mais ações para ${a.title}`}
                            disabled={pendingId === a.id}
                            className="rounded-full p-2 text-navy hover:bg-sand-soft/60 disabled:opacity-60"
                          >
                            {pendingId === a.id ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <MoreHorizontal className="size-4" aria-hidden />}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            {isPub ? (
                              <>
                                <DropdownMenuItem asChild>
                                  <a href={`/artigos/${a.slug}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="size-4" aria-hidden /> Ver no site
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => statusMutation.mutate({ row: a, next: "draft" })}>
                                  <Undo2 className="size-4" aria-hidden /> Despublicar
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem onSelect={() => statusMutation.mutate({ row: a, next: "published" })}>
                                <Send className="size-4" aria-hidden /> Publicar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setToDelete(a)} className="text-destructive focus:text-destructive">
                              <Trash2 className="size-4" aria-hidden /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {!isLoading && !error && rows.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
          {rows.length} de {all.length} {all.length === 1 ? "artigo" : "artigos"}
        </p>
      )}

      <AlertDialog open={toDelete !== null} onOpenChange={(o) => !o && !deleteMutation.isPending && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este artigo?</AlertDialogTitle>
            <AlertDialogDescription>
              “{toDelete?.title}” será removido definitivamente{toDelete?.status === "published" ? ", inclusive do site" : ""}. Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (toDelete) deleteMutation.mutate(toDelete);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />} Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Stat({
  label,
  value,
  loading,
  tone = "light",
  active,
  onClick,
}: {
  label: string;
  value: number;
  loading: boolean;
  tone?: "light" | "dark";
  active: boolean;
  onClick: () => void;
}) {
  const dark = tone === "dark";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border p-4 text-left transition-all sm:p-6",
        dark ? "border-navy bg-navy text-ivory" : "border-border bg-paper text-navy hover:border-sage/60",
        active && !dark && "border-sage ring-2 ring-sage/30",
        active && dark && "ring-2 ring-sand/60",
      )}
    >
      {dark && <span aria-hidden className="grain-layer absolute inset-0 -z-10" />}
      <dt className={cn("text-xs font-semibold tracking-wide uppercase sm:text-sm sm:normal-case sm:tracking-normal", dark ? "text-sand" : "text-muted-foreground")}>
        {label}
      </dt>
      <dd className="mt-2 font-display text-3xl leading-none sm:text-5xl">
        {loading ? <span className="inline-block h-8 w-10 animate-pulse rounded bg-current/15 align-middle" /> : value}
      </dd>
    </button>
  );
}
