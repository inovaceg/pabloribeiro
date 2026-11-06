import { describe, expect, it } from "vitest";

import { slugify } from "./article-body";
import { validateArticleForm } from "./article-form";

const base = {
  title: "Ansiedade no dia a dia",
  slug: "ansiedade-no-dia-a-dia",
  category: "Saúde emocional",
  description: "Um resumo curto.",
  body: "Texto ".repeat(20),
  cover_alt: "",
};

describe("validateArticleForm", () => {
  it("generates a valid slug from a Portuguese title", () => {
    expect(slugify("Ansiedade: o que é e como a TCC ajuda?")).toBe("ansiedade-o-que-e-e-como-a-tcc-ajuda");
  });

  it("rejects slugs with spaces, accents or uppercase", () => {
    for (const slug of ["com espaço", "ação", "Maiuscula", "-inicio", "fim-"]) {
      const r = validateArticleForm({ ...base, slug }, "draft", false);
      expect(r.ok).toBe(false);
    }
  });

  it("allows saving a draft with an empty body and description", () => {
    const r = validateArticleForm({ ...base, body: "", description: "" }, "draft", false);
    expect(r.ok).toBe(true);
  });

  it("blocks publishing without body text", () => {
    const r = validateArticleForm({ ...base, body: "curto" }, "published", false);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors["body"]).toBeDefined();
  });

  it("blocks publishing without a description", () => {
    const r = validateArticleForm({ ...base, description: "  " }, "published", false);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors["description"]).toBeDefined();
  });

  it("requires cover alt text to publish when there is a cover", () => {
    expect(validateArticleForm(base, "published", true).ok).toBe(false);
    expect(validateArticleForm({ ...base, cover_alt: "Pessoa lendo" }, "published", true).ok).toBe(true);
  });
});
