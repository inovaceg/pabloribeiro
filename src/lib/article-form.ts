import { z } from "zod";

import { SLUG_PATTERN } from "./article-body";

export type ArticleStatus = "draft" | "published";

/** Minimum body length (characters) required to publish. Drafts may be empty. */
export const MIN_PUBLISH_BODY = 50;

export const articleFormSchema = z.object({
  title: z.string().trim().min(3, "O título precisa ter pelo menos 3 caracteres.").max(160, "Use no máximo 160 caracteres."),
  slug: z
    .string()
    .trim()
    .min(1, "Informe o endereço do artigo.")
    .max(120, "Use no máximo 120 caracteres.")
    .regex(SLUG_PATTERN, "Use apenas letras minúsculas, números e hífens (sem espaços ou acentos)."),
  category: z.string().trim().min(1, "Escolha uma categoria.").max(60),
  description: z.string().trim().max(300, "Use no máximo 300 caracteres."),
  body: z.string().max(60000, "O texto está longo demais."),
  cover_alt: z.string().trim().max(200, "Use no máximo 200 caracteres."),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

/**
 * Validates the editor fields for the requested status.
 * Publishing additionally requires a description, a real body and alt text when there is a cover.
 */
export function validateArticleForm(
  input: ArticleFormValues,
  status: ArticleStatus,
  hasCover: boolean,
): { ok: true; data: ArticleFormValues } | { ok: false; errors: Record<string, string> } {
  const parsed = articleFormSchema.safeParse(input);
  const errors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
  }
  if (status === "published") {
    if (!errors["body"] && input.body.trim().length < MIN_PUBLISH_BODY) {
      errors["body"] = "Escreva o texto do artigo antes de publicar.";
    }
    if (!errors["description"] && !input.description.trim()) {
      errors["description"] = "Escreva um resumo antes de publicar (ele aparece no Google).";
    }
    if (hasCover && !errors["cover_alt"] && !input.cover_alt.trim()) {
      errors["cover_alt"] = "Descreva a imagem de capa antes de publicar.";
    }
  }
  if (Object.keys(errors).length || !parsed.success) return { ok: false, errors };
  return { ok: true, data: parsed.data };
}
