COMMENT ON COLUMN public.articles.cover_url IS 'DEPRECATED: replaced by cover_path (covers live in the private article-covers bucket)';
ALTER TABLE public.articles ADD COLUMN cover_path text
  CHECK (cover_path IS NULL OR (cover_path ~ '^[A-Za-z0-9/_.-]+$' AND char_length(cover_path) <= 200));

-- Cover images are shown on the public site, so anyone may read files in this bucket.
CREATE POLICY "Article covers are readable by everyone" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'article-covers');