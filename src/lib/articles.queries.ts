import { queryOptions } from "@tanstack/react-query";

import { getPublishedArticle, listPublishedArticles } from "./articles.functions";

export const publishedArticlesQuery = () =>
  queryOptions({
    queryKey: ["articles", "published"],
    queryFn: () => listPublishedArticles(),
    staleTime: 60_000,
  });

export const publishedArticleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["articles", "published", slug],
    queryFn: () => getPublishedArticle({ data: { slug } }),
    staleTime: 60_000,
  });
