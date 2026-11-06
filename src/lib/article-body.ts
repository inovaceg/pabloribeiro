/**
 * Article body format (plain text, easy to write in a textarea):
 *   - blank line  → new paragraph
 *   - "## Title"  → section heading
 *   - "- item"    → bullet list item (consecutive lines form one list)
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

export function parseArticleBody(body: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: "list", items: list });
    list = [];
  };

  for (const raw of body.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
    } else if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      const text = line.slice(3).trim();
      if (text) blocks.push({ type: "h2", text });
    } else if (/^[-•*]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-•*]\s+/, ""));
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

/** Estimated reading time at ~200 words per minute, minimum 1. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "Ansiedade no dia a dia!" → "ansiedade-no-dia-a-dia" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const ARTICLE_CATEGORIES = [
  "Psicoterapia",
  "TCC",
  "Avaliação Neuropsicológica",
  "Saúde emocional",
] as const;

/** Public URL path for a cover image stored in the article-covers bucket. */
export function coverUrlFor(path: string | null | undefined): string | null {
  return path ? `/api/public/capas/${path}` : null;
}
