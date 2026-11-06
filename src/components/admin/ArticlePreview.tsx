import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Clock, Eye, X } from "lucide-react";

import { site } from "@/config/site";
import { readingMinutes } from "@/lib/article-body";
import { ArticleBody, formatDate } from "@/components/site/articles";
import { Eyebrow } from "@/components/site/primitives";
import { buttonClass } from "@/components/site/booking";

export type PreviewData = {
  title: string;
  description: string;
  category: string;
  body: string;
  coverUrl: string | null;
  coverAlt: string;
  publishedAt: string | null;
};

/**
 * Full-screen, private preview that mirrors the public article page layout.
 * Renders the editor's current (unsaved) state; nothing is published.
 */
export function ArticlePreviewDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PreviewData;
}) {
  const date = data.publishedAt ?? new Date().toISOString();
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy/60 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 overflow-y-auto bg-background focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-sand/40 bg-sand-soft px-4 py-2.5 text-sm text-navy sm:px-6">
            <DialogPrimitive.Title className="inline-flex items-center gap-2 font-medium">
              <Eye className="size-4" aria-hidden /> Pré-visualização — visível só para você
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-1.5 text-ivory hover:bg-navy-deep">
              <X className="size-4" aria-hidden /> Fechar
            </DialogPrimitive.Close>
          </div>

          <section className="relative isolate overflow-hidden bg-navy pt-16 pb-14 text-ivory sm:pt-24 sm:pb-20">
            <div aria-hidden className="grain-layer absolute inset-0 -z-10" />
            <div aria-hidden className="pointer-events-none absolute -top-32 right-[-12%] -z-10 size-[30rem] rounded-full bg-sage/25 blur-3xl" />
            <div className="container-site max-w-3xl">
              <Eyebrow className="text-sand">{data.category}</Eyebrow>
              <h1 className="mt-5 text-[2.2rem] leading-[1.08] text-ivory sm:text-5xl">{data.title || "Sem título"}</h1>
              {data.description && <p className="mt-6 text-lg leading-relaxed text-ivory/75">{data.description}</p>}
              <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ivory/70">
                <span className="font-semibold text-ivory">{site.name}</span>
                <span>
                  {site.role} · {site.crp}
                </span>
                <span aria-hidden className="text-sand">|</span>
                <span>{formatDate(date)}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden /> {readingMinutes(data.body)} min
                </span>
              </p>
            </div>
          </section>

          <article className="py-14 sm:py-20">
            <div className="container-site max-w-3xl">
              {data.coverUrl && (
                <img src={data.coverUrl} alt={data.coverAlt} className="mb-12 aspect-[16/9] w-full rounded-2xl object-cover" />
              )}
              {data.body.trim() ? (
                <ArticleBody body={data.body} />
              ) : (
                <p className="text-muted-foreground">O texto do artigo ainda está vazio.</p>
              )}
              <div className="mt-14 rounded-2xl bg-sage-soft/70 p-7 sm:p-9">
                <p className="font-display text-2xl leading-snug text-navy">Quer conversar sobre isso?</p>
                <p className="mt-3 leading-relaxed text-navy/75">
                  Atendimento presencial em {site.city} – {site.state} e online. Tire suas dúvidas pelo WhatsApp.
                </p>
                <span aria-hidden className={buttonClass("whatsapp", "mt-6 pointer-events-none")}>Falar no WhatsApp</span>
              </div>
            </div>
          </article>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
