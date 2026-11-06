import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Eye,
  Heading2,
  ImagePlus,
  List,
  Loader2,
  MonitorPlay,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { ARTICLE_CATEGORIES, coverUrlFor, readingMinutes, SLUG_PATTERN, slugify } from "@/lib/article-body";
import { validateArticleForm, type ArticleStatus } from "@/lib/article-form";
import {
  COVER_BUCKET,
  deleteArticle,
  friendlyError,
  invalidateArticleQueries,
  isSlugTaken,
  type AdminArticle,
} from "@/lib/admin-articles";
import { cn } from "@/lib/utils";
import { ArticleBody, formatDate } from "@/components/site/articles";
import { buttonClass } from "@/components/site/booking";
import { ArticlePreviewDialog } from "./ArticlePreview";
import { StatusBadge } from "./StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MAX_COVER_BYTES = 5 * 1024 * 1024;
const COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];

const fieldClass =
  "w-full rounded-md border border-input bg-paper px-4 py-3 text-[0.95rem] text-navy placeholder:text-muted-foreground/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30 aria-[invalid=true]:border-destructive";

type SlugState = "idle" | "checking" | "free" | "taken";

export function ArticleEditor({ article }: { article?: AdminArticle }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [slugState, setSlugState] = useState<SlugState>("idle");
  const [category, setCategory] = useState(article?.category ?? ARTICLE_CATEGORIES[0]);
  const [description, setDescription] = useState(article?.description ?? "");
  const [body, setBody] = useState(article?.body ?? "");
  const [coverAlt, setCoverAlt] = useState(article?.cover_alt ?? "");
  const [coverPath, setCoverPath] = useState<string | null>(article?.cover_path ?? null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState<ArticleStatus | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPublished = article?.status === "published";
  const shownCover = coverPreview ?? coverUrlFor(coverPath);

  const dirty = useMemo(() => {
    if (!article) return Boolean(title || description || body || coverFile);
    return (
      title !== article.title ||
      slug !== article.slug ||
      category !== article.category ||
      description !== article.description ||
      body !== article.body ||
      coverAlt !== article.cover_alt ||
      coverPath !== article.cover_path ||
      coverFile !== null
    );
  }, [article, title, slug, category, description, body, coverAlt, coverPath, coverFile]);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty || saving) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, saving]);

  // Release object URLs created for the local cover preview.
  useEffect(() => () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);

  const clearError = (key: string) => setErrors((e) => (e[key] ? { ...e, [key]: "" } : e));

  const onTitle = (v: string) => {
    setTitle(v);
    clearError("title");
    if (!slugTouched) {
      setSlug(slugify(v));
      setSlugState("idle");
    }
  };

  const checkSlug = async (value = slug) => {
    if (!value || !SLUG_PATTERN.test(value)) return;
    if (article && value === article.slug) {
      setSlugState("free");
      return;
    }
    setSlugState("checking");
    try {
      const taken = await isSlugTaken(value, article?.id);
      setSlugState(taken ? "taken" : "free");
      if (taken) setErrors((e) => ({ ...e, slug: "Já existe um artigo com este endereço." }));
    } catch {
      setSlugState("idle");
    }
  };

  const prefixLine = (prefix: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = body.lastIndexOf("\n", start - 1) + 1;
    if (body.slice(lineStart).startsWith(prefix)) return el.focus();
    const next = body.slice(0, lineStart) + prefix + body.slice(lineStart);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  };

  const onPickCover = (file: File | undefined) => {
    if (!file) return;
    if (!COVER_TYPES.includes(file.type)) {
      toast.error("Use uma imagem JPG, PNG ou WEBP.");
      return;
    }
    if (file.size > MAX_COVER_BYTES) {
      toast.error("A imagem precisa ter no máximo 5 MB.");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setCoverPath(null);
    clearError("cover_alt");
    if (fileRef.current) fileRef.current.value = "";
  };

  const save = async (status: ArticleStatus) => {
    const result = validateArticleForm(
      { title, slug, category, description, body, cover_alt: coverAlt },
      status,
      Boolean(shownCover),
    );
    if (!result.ok) {
      setErrors(result.errors);
      toast.error("Confira os campos destacados.");
      const first = Object.keys(result.errors)[0];
      if (first) document.getElementById(first === "body" ? "body" : first)?.focus();
      return;
    }
    setErrors({});
    setSaving(status);

    try {
      if (await isSlugTaken(result.data.slug, article?.id)) {
        setSlugState("taken");
        setErrors({ slug: "Já existe um artigo com este endereço." });
        toast.error("Já existe um artigo com este endereço. Altere o link.");
        document.getElementById("slug")?.focus();
        setSaving(null);
        return;
      }
    } catch {
      // Fall through: the database unique constraint still protects against duplicates.
    }

    let newCoverPath = coverPath;
    let uploadedPath: string | null = null;
    if (coverFile) {
      const ext = coverFile.type === "image/png" ? "png" : coverFile.type === "image/webp" ? "webp" : "jpg";
      const path = `covers/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(COVER_BUCKET)
        .upload(path, coverFile, { contentType: coverFile.type, cacheControl: "86400" });
      if (upErr) {
        console.error("cover upload failed", upErr);
        setSaving(null);
        toast.error("Não foi possível enviar a imagem de capa. Tente outra imagem ou salve sem capa.");
        return;
      }
      newCoverPath = path;
      uploadedPath = path;
    }

    const payload = { ...result.data, cover_path: newCoverPath, status };
    const res = article
      ? await supabase.from("articles").update(payload).eq("id", article.id).select("id").single()
      : await supabase.from("articles").insert(payload).select("id").single();

    if (res.error) {
      console.error("article save failed", res.error);
      if (uploadedPath) await supabase.storage.from(COVER_BUCKET).remove([uploadedPath]);
      setSaving(null);
      if (res.error.code === "23505") {
        setSlugState("taken");
        setErrors({ slug: "Já existe um artigo com este endereço." });
      }
      toast.error(friendlyError(res.error, "Não foi possível salvar o artigo. Tente novamente."));
      return;
    }

    const oldPath = article?.cover_path;
    if (oldPath && oldPath !== newCoverPath) {
      await supabase.storage.from(COVER_BUCKET).remove([oldPath]);
    }

    await invalidateArticleQueries(queryClient);
    const message = !article
      ? status === "published"
        ? "Artigo publicado no site."
        : "Rascunho criado."
      : status === "published"
        ? isPublished
          ? "Alterações publicadas."
          : "Artigo publicado no site."
        : isPublished
          ? "Artigo despublicado — voltou para rascunho."
          : "Rascunho salvo.";
    toast.success(message);
    setCoverFile(null);
    setSaving(null);
    if (!article) {
      navigate({ to: "/admin/$id", params: { id: res.data.id }, replace: true });
    }
  };

  const onDelete = async () => {
    if (!article) return;
    setDeleting(true);
    try {
      await deleteArticle(article);
      await invalidateArticleQueries(queryClient);
      toast.success("Artigo excluído.");
      navigate({ to: "/admin" });
    } catch (err) {
      console.error(err);
      setDeleting(false);
      toast.error(friendlyError(err, "Não foi possível excluir o artigo."));
    }
  };

  const busy = Boolean(saving) || deleting;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(isPublished ? "published" : "draft");
      }}
      noValidate
      className="container-site max-w-6xl py-8 sm:py-10"
    >
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-navy/70 hover:text-navy">
        <ArrowLeft className="size-4" aria-hidden /> Todos os artigos
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl text-navy sm:text-4xl">{article ? "Editar artigo" : "Novo artigo"}</h1>
          {article && <StatusBadge status={article.status} />}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {article?.published_at && <span>Publicado em {formatDate(article.published_at)}</span>}
          {article && <span>Atualizado em {formatDate(article.updated_at)}</span>}
          {dirty && <span className="font-medium text-sand">• Alterações não salvas</span>}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Field label="Título" error={errors["title"]} htmlFor="title">
            <input
              id="title"
              value={title}
              onChange={(e) => onTitle(e.target.value)}
              maxLength={160}
              placeholder="Ex.: Ansiedade no dia a dia"
              className={cn(fieldClass, "font-display text-xl")}
              aria-invalid={!!errors["title"]}
            />
          </Field>

          <Field
            label="Resumo (descrição para o Google)"
            hint={`Aparece nos cards do site e nos resultados de busca. ${description.length}/300`}
            error={errors["description"]}
            htmlFor="description"
          >
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                clearError("description");
              }}
              maxLength={300}
              className={cn(fieldClass, "resize-y")}
              aria-invalid={!!errors["description"]}
            />
          </Field>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="body" className="text-sm font-medium text-navy">
                Texto do artigo
              </label>
              <div role="tablist" aria-label="Modo do editor" className="flex rounded-full border border-border bg-paper p-1 text-sm">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "write"}
                  onClick={() => setTab("write")}
                  className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1", tab === "write" ? "bg-navy text-ivory" : "text-navy")}
                >
                  <Pencil className="size-3.5" aria-hidden /> Escrever
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "preview"}
                  onClick={() => setTab("preview")}
                  className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1", tab === "preview" ? "bg-navy text-ivory" : "text-navy")}
                >
                  <Eye className="size-3.5" aria-hidden /> Texto formatado
                </button>
              </div>
            </div>
            {tab === "write" ? (
              <>
                <div className="flex flex-wrap gap-1 rounded-t-md border border-b-0 border-input bg-sand-soft/50 px-2 py-1.5">
                  <button type="button" onClick={() => prefixLine("## ")} className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-navy hover:bg-paper">
                    <Heading2 className="size-4" aria-hidden /> Subtítulo
                  </button>
                  <button type="button" onClick={() => prefixLine("- ")} className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-navy hover:bg-paper">
                    <List className="size-4" aria-hidden /> Item de lista
                  </button>
                </div>
                <textarea
                  id="body"
                  ref={bodyRef}
                  rows={22}
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    clearError("body");
                  }}
                  aria-invalid={!!errors["body"]}
                  aria-describedby="body-help"
                  className={cn(fieldClass, "rounded-t-none leading-relaxed")}
                  placeholder={"Escreva o texto aqui.\n\nDeixe uma linha em branco entre parágrafos.\n\n## Isto vira um subtítulo\n\n- Isto vira um item de lista\n- Outro item"}
                />
                <p id="body-help" className="mt-1.5 text-xs text-muted-foreground">
                  Linha em branco = novo parágrafo · “## ” no início da linha = subtítulo · “- ” no início = item de lista · cerca de{" "}
                  {readingMinutes(body)} min de leitura
                </p>
              </>
            ) : (
              <div className="min-h-80 rounded-md border border-input bg-paper p-6 sm:p-8">
                {body.trim() ? <ArticleBody body={body} /> : <p className="text-muted-foreground">Nada para mostrar ainda.</p>}
              </div>
            )}
            {errors["body"] && (
              <p role="alert" className="mt-1.5 text-sm text-destructive">
                {errors["body"]}
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <div className="space-y-3 rounded-2xl border border-border bg-paper p-5 lg:sticky lg:top-6">
            <button type="button" onClick={() => setPreviewOpen(true)} className={buttonClass("outline", "w-full py-3")}>
              <MonitorPlay className="size-4" aria-hidden /> Pré-visualizar como no site
            </button>
            {isPublished ? (
              <>
                <button type="button" disabled={busy} onClick={() => save("published")} className={buttonClass("primary", "w-full py-3 disabled:opacity-60")}>
                  {saving === "published" && <Loader2 className="size-4 animate-spin" aria-hidden />} Salvar e manter publicado
                </button>
                <button type="button" disabled={busy} onClick={() => save("draft")} className="w-full rounded-full px-4 py-2.5 text-sm text-navy underline-offset-4 hover:underline disabled:opacity-60">
                  {saving === "draft" ? "Despublicando…" : "Despublicar (voltar a rascunho)"}
                </button>
                <a
                  href={`/artigos/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-sm text-sage hover:text-navy"
                >
                  <ExternalLink className="size-4" aria-hidden /> Ver no site
                </a>
              </>
            ) : (
              <>
                <button type="button" disabled={busy} onClick={() => save("published")} className={buttonClass("primary", "w-full py-3 disabled:opacity-60")}>
                  {saving === "published" && <Loader2 className="size-4 animate-spin" aria-hidden />} Publicar
                </button>
                <button type="button" disabled={busy} onClick={() => save("draft")} className={buttonClass("outline", "w-full py-3 disabled:opacity-60")}>
                  {saving === "draft" && <Loader2 className="size-4 animate-spin" aria-hidden />} Salvar rascunho
                </button>
                <p className="text-center text-xs text-muted-foreground">Rascunhos não aparecem no site.</p>
              </>
            )}
          </div>

          <div className="space-y-5 rounded-2xl border border-border bg-paper p-5">
            <Field label="Categoria" htmlFor="category" error={errors["category"]}>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass}>
                {[...new Set<string>([...ARTICLE_CATEGORIES, category])].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Endereço (link)"
              hint={
                isPublished && article && slug !== article.slug
                  ? "Atenção: mudar o link de um artigo publicado quebra links já compartilhados."
                  : `Gerado a partir do título. pabloribeiro…/artigos/${slug || "…"}`
              }
              error={errors["slug"]}
              htmlFor="slug"
              status={
                slugState === "checking" ? (
                  <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-label="Verificando" />
                ) : slugState === "free" && !errors["slug"] ? (
                  <span className="inline-flex items-center gap-1 text-xs text-sage">
                    <Check className="size-3.5" aria-hidden /> disponível
                  </span>
                ) : null
              }
            >
              <div className="flex gap-2">
                <input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    setSlugState("idle");
                    clearError("slug");
                  }}
                  onBlur={() => checkSlug()}
                  maxLength={120}
                  spellCheck={false}
                  className={fieldClass}
                  aria-invalid={!!errors["slug"]}
                />
                {slugTouched && title && slugify(title) !== slug && (
                  <button
                    type="button"
                    onClick={() => {
                      const s = slugify(title);
                      setSlug(s);
                      clearError("slug");
                      checkSlug(s);
                    }}
                    className="shrink-0 rounded-md border border-input px-3 text-xs text-navy hover:bg-sand-soft/50"
                    title="Gerar a partir do título"
                  >
                    Do título
                  </button>
                )}
              </div>
            </Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-paper p-5">
            <span className="block text-sm font-medium text-navy">Imagem de capa</span>
            {shownCover ? (
              <div className="relative overflow-hidden rounded-lg">
                <img src={shownCover} alt="" className="aspect-[16/9] w-full object-cover" />
                <button
                  type="button"
                  onClick={removeCover}
                  aria-label="Remover imagem de capa"
                  className="absolute top-2 right-2 rounded-full bg-navy/80 p-1.5 text-ivory hover:bg-navy"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-navy/25 text-sm text-muted-foreground transition-colors hover:border-sage hover:text-navy"
              >
                <ImagePlus className="size-6" aria-hidden /> Escolher imagem
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              aria-label="Arquivo da imagem de capa"
              onChange={(e) => onPickCover(e.target.files?.[0])}
            />
            {shownCover && (
              <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-navy underline underline-offset-4">
                Trocar imagem
              </button>
            )}
            <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP, até 5 MB. Formato horizontal funciona melhor.</p>
            <Field
              label="Descrição da imagem"
              hint="Para leitores de tela. Ex.: “Pessoa sentada lendo à janela”."
              htmlFor="cover_alt"
              error={errors["cover_alt"]}
            >
              <input
                id="cover_alt"
                value={coverAlt}
                onChange={(e) => {
                  setCoverAlt(e.target.value);
                  clearError("cover_alt");
                }}
                maxLength={200}
                className={fieldClass}
                aria-invalid={!!errors["cover_alt"]}
              />
            </Field>
          </div>

          {article && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button type="button" disabled={busy} className="inline-flex items-center gap-2 px-1 text-sm text-destructive hover:underline disabled:opacity-60">
                  <Trash2 className="size-4" aria-hidden /> Excluir artigo
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir este artigo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    “{article.title}” será removido definitivamente{isPublished ? ", inclusive do site" : ""}. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </aside>
      </div>

      <ArticlePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={{
          title,
          description,
          category,
          body,
          coverUrl: shownCover,
          coverAlt,
          publishedAt: article?.published_at ?? null,
        }}
      />
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  htmlFor,
  status,
  children,
}: {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  htmlFor: string;
  status?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-navy">
          {label}
        </label>
        {status}
      </div>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
