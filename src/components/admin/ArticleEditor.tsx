import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Eye, Heading2, ImagePlus, List, Loader2, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ARTICLE_CATEGORIES, coverUrlFor, readingMinutes, SLUG_PATTERN, slugify } from "@/lib/article-body";
import { cn } from "@/lib/utils";
import { ArticleBody } from "@/components/site/articles";
import { buttonClass } from "@/components/site/booking";
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

export type AdminArticle = Database["public"]["Tables"]["articles"]["Row"];
type Status = Database["public"]["Enums"]["article_status"];

const MAX_COVER_BYTES = 5 * 1024 * 1024;
const COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];

const schema = z.object({
  title: z.string().trim().min(3, "O título precisa ter pelo menos 3 caracteres.").max(160, "Use no máximo 160 caracteres."),
  slug: z
    .string()
    .trim()
    .min(1, "Informe o endereço do artigo.")
    .max(120, "Endereço muito longo.")
    .regex(SLUG_PATTERN, "Use apenas letras minúsculas, números e hífens."),
  category: z.string().trim().min(1, "Escolha uma categoria.").max(60),
  description: z.string().trim().max(300, "Use no máximo 300 caracteres."),
  body: z.string().max(60000, "O texto está longo demais."),
  cover_alt: z.string().trim().max(200, "Use no máximo 200 caracteres."),
});

const fieldClass =
  "w-full rounded-md border border-input bg-paper px-4 py-3 text-[0.95rem] text-navy placeholder:text-muted-foreground/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30 aria-[invalid=true]:border-destructive";

export function ArticleEditor({ article }: { article?: AdminArticle }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [category, setCategory] = useState(article?.category ?? ARTICLE_CATEGORIES[0]);
  const [description, setDescription] = useState(article?.description ?? "");
  const [body, setBody] = useState(article?.body ?? "");
  const [coverAlt, setCoverAlt] = useState(article?.cover_alt ?? "");
  const [coverPath, setCoverPath] = useState<string | null>(article?.cover_path ?? null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState<Status | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPublished = article?.status === "published";
  const shownCover = coverPreview ?? coverUrlFor(coverPath);

  const onTitle = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const prefixLine = (prefix: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = body.lastIndexOf("\n", start - 1) + 1;
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
    if (fileRef.current) fileRef.current.value = "";
  };

  const save = async (status: Status, e?: FormEvent) => {
    e?.preventDefault();
    const parsed = schema.safeParse({ title, slug, category, description, body, cover_alt: coverAlt });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      toast.error("Confira os campos destacados.");
      return;
    }
    if (status === "published" && parsed.data.body.trim().length < 50) {
      setErrors({ body: "Escreva o texto do artigo antes de publicar." });
      toast.error("Escreva o texto do artigo antes de publicar.");
      return;
    }
    setErrors({});
    setSaving(status);

    let newCoverPath = coverPath;
    if (coverFile) {
      const ext = coverFile.type === "image/png" ? "png" : coverFile.type === "image/webp" ? "webp" : "jpg";
      const path = `covers/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("article-covers")
        .upload(path, coverFile, { contentType: coverFile.type, cacheControl: "86400" });
      if (upErr) {
        setSaving(null);
        toast.error("Não foi possível enviar a imagem de capa.");
        return;
      }
      newCoverPath = path;
    }

    const payload = { ...parsed.data, cover_path: newCoverPath, status };
    const result = article
      ? await supabase.from("articles").update(payload).eq("id", article.id).select("id").single()
      : await supabase.from("articles").insert(payload).select("id").single();

    if (result.error) {
      setSaving(null);
      if (result.error.code === "23505") {
        setErrors({ slug: "Já existe um artigo com este endereço." });
        toast.error("Já existe um artigo com este endereço.");
      } else {
        toast.error("Não foi possível salvar o artigo.");
      }
      return;
    }

    // Best-effort cleanup of a replaced or removed cover image.
    const oldPath = article?.cover_path;
    if (oldPath && oldPath !== newCoverPath) {
      await supabase.storage.from("article-covers").remove([oldPath]);
    }

    await queryClient.invalidateQueries({ queryKey: ["articles"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    toast.success(status === "published" ? "Artigo publicado." : "Rascunho salvo.");
    navigate({ to: "/admin" });
  };

  const onDelete = async () => {
    if (!article) return;
    const { error } = await supabase.from("articles").delete().eq("id", article.id);
    if (error) {
      toast.error("Não foi possível excluir o artigo.");
      return;
    }
    if (article.cover_path) await supabase.storage.from("article-covers").remove([article.cover_path]);
    await queryClient.invalidateQueries({ queryKey: ["articles"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    toast.success("Artigo excluído.");
    navigate({ to: "/admin" });
  };

  return (
    <form onSubmit={(e) => save(isPublished ? "published" : "draft", e)} noValidate className="container-site max-w-5xl py-10">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-navy/70 hover:text-navy">
        <ArrowLeft className="size-4" /> Todos os artigos
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-navy">{article ? "Editar artigo" : "Novo artigo"}</h1>
        {article && (
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              isPublished ? "bg-sage-soft text-navy" : "bg-sand-soft text-navy",
            )}
          >
            {isPublished ? "Publicado" : "Rascunho"}
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Field label="Título" error={errors["title"]} htmlFor="title">
            <input id="title" value={title} onChange={(e) => onTitle(e.target.value)} maxLength={160} className={cn(fieldClass, "font-display text-xl")} aria-invalid={!!errors["title"]} />
          </Field>

          <Field
            label="Resumo"
            hint="Aparece nos cards e no Google. Até 300 caracteres."
            error={errors["description"]}
            htmlFor="description"
          >
            <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} className={cn(fieldClass, "resize-y")} aria-invalid={!!errors["description"]} />
          </Field>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-medium text-navy">Texto do artigo</span>
              <div className="flex rounded-full border border-border bg-paper p-1 text-sm">
                <button type="button" onClick={() => setTab("write")} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1", tab === "write" && "bg-navy text-ivory")}>
                  <Pencil className="size-3.5" /> Escrever
                </button>
                <button type="button" onClick={() => setTab("preview")} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1", tab === "preview" && "bg-navy text-ivory")}>
                  <Eye className="size-3.5" /> Visualizar
                </button>
              </div>
            </div>
            {tab === "write" ? (
              <>
                <div className="flex gap-2 rounded-t-md border border-b-0 border-input bg-sand-soft/40 px-2 py-1.5">
                  <button type="button" onClick={() => prefixLine("## ")} className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-navy hover:bg-paper">
                    <Heading2 className="size-4" /> Subtítulo
                  </button>
                  <button type="button" onClick={() => prefixLine("- ")} className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-navy hover:bg-paper">
                    <List className="size-4" /> Lista
                  </button>
                </div>
                <textarea
                  ref={bodyRef}
                  rows={20}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  aria-label="Texto do artigo"
                  aria-invalid={!!errors["body"]}
                  className={cn(fieldClass, "rounded-t-none font-mono text-sm leading-relaxed")}
                  placeholder={"Escreva o texto aqui.\n\nDeixe uma linha em branco entre parágrafos.\n\n## Isto vira um subtítulo\n\n- Isto vira um item de lista\n- Outro item"}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Linha em branco = novo parágrafo · “## ” no início = subtítulo · “- ” no início = item de lista · ~{readingMinutes(body)} min de leitura
                </p>
              </>
            ) : (
              <div className="min-h-80 rounded-md border border-input bg-paper p-6 sm:p-8">
                {body.trim() ? <ArticleBody body={body} /> : <p className="text-muted-foreground">Nada para visualizar ainda.</p>}
              </div>
            )}
            {errors["body"] && <p role="alert" className="mt-1.5 text-sm text-destructive">{errors["body"]}</p>}
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="space-y-3 rounded-2xl border border-border bg-paper p-5">
            {isPublished ? (
              <>
                <button type="button" disabled={!!saving} onClick={() => save("published")} className={buttonClass("primary", "w-full")}>
                  {saving === "published" && <Loader2 className="size-4 animate-spin" />} Salvar alterações
                </button>
                <button type="button" disabled={!!saving} onClick={() => save("draft")} className={buttonClass("outline", "w-full")}>
                  {saving === "draft" && <Loader2 className="size-4 animate-spin" />} Despublicar (voltar a rascunho)
                </button>
              </>
            ) : (
              <>
                <button type="button" disabled={!!saving} onClick={() => save("published")} className={buttonClass("primary", "w-full")}>
                  {saving === "published" && <Loader2 className="size-4 animate-spin" />} Publicar
                </button>
                <button type="button" disabled={!!saving} onClick={() => save("draft")} className={buttonClass("outline", "w-full")}>
                  {saving === "draft" && <Loader2 className="size-4 animate-spin" />} Salvar rascunho
                </button>
              </>
            )}
            {isPublished && article && (
              <a href={`/artigos/${article.slug}`} target="_blank" rel="noopener noreferrer" className="block text-center text-sm text-navy underline underline-offset-4">
                Ver no site
              </a>
            )}
          </div>

          <div className="space-y-5 rounded-2xl border border-border bg-paper p-5">
            <Field label="Categoria" htmlFor="category" error={errors["category"]}>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass}>
                {[...new Set([...ARTICLE_CATEGORIES, category])].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Endereço (link)" hint={`/artigos/${slug || "..."}`} htmlFor="slug" error={errors["slug"]}>
              <input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value.toLowerCase());
                }}
                maxLength={120}
                className={fieldClass}
                aria-invalid={!!errors["slug"]}
              />
            </Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-paper p-5">
            <span className="block text-sm font-medium text-navy">Imagem de capa</span>
            {shownCover ? (
              <div className="relative overflow-hidden rounded-lg">
                <img src={shownCover} alt="" className="aspect-[16/9] w-full object-cover" />
                <button type="button" onClick={removeCover} aria-label="Remover imagem de capa" className="absolute top-2 right-2 rounded-full bg-navy/80 p-1.5 text-ivory hover:bg-navy">
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-navy/25 text-sm text-muted-foreground hover:border-sage hover:text-navy">
                <ImagePlus className="size-6" /> Escolher imagem
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Imagem de capa" onChange={(e) => onPickCover(e.target.files?.[0])} />
            {shownCover && (
              <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-navy underline underline-offset-4">
                Trocar imagem
              </button>
            )}
            <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP, até 5 MB. Formato horizontal funciona melhor.</p>
            <Field label="Descrição da imagem" hint="Para leitores de tela. Ex.: “Pessoa sentada lendo à janela”." htmlFor="cover_alt" error={errors["cover_alt"]}>
              <input id="cover_alt" value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} maxLength={200} className={fieldClass} />
            </Field>
          </div>

          {article && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button type="button" className="inline-flex items-center gap-2 text-sm text-destructive hover:underline">
                  <Trash2 className="size-4" /> Excluir artigo
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir este artigo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    “{article.title}” será removido do site definitivamente. Esta ação não pode ser desfeita.
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
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | undefined;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-navy">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && <p role="alert" className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
