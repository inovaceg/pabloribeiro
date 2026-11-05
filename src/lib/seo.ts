import { SITE_URL } from "@/config/site";

type PageHeadInput = {
  title: string;
  description: string;
  path: string;
  /** Absolute https URL of an image shown on the page. */
  image?: string;
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

/** Per-route head metadata: title, description, Open Graph, Twitter and canonical. */
export function pageHead({ title, description, path, image }: PageHeadInput) {
  const url = absoluteUrl(path);
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:locale", content: "pt_BR" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }
  return { meta, links: [{ rel: "canonical", href: url }] };
}
