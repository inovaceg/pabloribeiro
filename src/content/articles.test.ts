import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import { ARTICLES } from "./articles";

describe("artigos", () => {
  it("every article has a unique slug", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every article is listed in the sitemap", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    for (const a of ARTICLES) {
      expect(sitemap).toContain(`https://pabloribeiro.lovable.app/artigos/${a.slug}</loc>`);
    }
  });
});
