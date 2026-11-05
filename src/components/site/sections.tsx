import { ArrowUpRight } from "lucide-react";

import { site, instagramUrl } from "@/config/site";
import instaCrescimento from "@/assets/instagram_post_crescimento.jpg.asset.json";
import instaTraumas from "@/assets/instagram_post_traumas.jpg.asset.json";
import instaSentir from "@/assets/instagram_post_sentir.jpg.asset.json";
import { BookingButton, buttonClass } from "./booking";
import { InstagramIcon } from "./icons";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./primitives";

/** Closing call-to-action used across pages. */
export function CtaBand({
  title = "Quando sentir que é o momento, estou à disposição para conversar.",
  text = "Fale comigo pelo WhatsApp para tirar dúvidas, conhecer as modalidades de atendimento e verificar horários disponíveis.",
  message,
}: {
  title?: string;
  text?: string;
  message?: string;
}) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-site">
        <Reveal className="relative overflow-hidden rounded-2xl bg-navy px-7 py-14 text-ivory sm:px-14 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full border border-sand/25"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -bottom-16 size-64 rounded-full border border-sage/30"
          />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow className="text-sand">Agendamento</Eyebrow>
              <h2 className="mt-5 text-3xl leading-[1.15] text-ivory sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <p className="mt-6 max-w-xl leading-relaxed text-ivory/70">{text}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
              <BookingButton variant="light" {...(message ? { message } : {})}>Agendar pelo WhatsApp</BookingButton>
              <p className="text-xs text-ivory/50 lg:text-right">
                {site.name} · {site.crp}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const POSTS = [
  { img: instaCrescimento.url, alt: "Post: Psicoterapia não é só para crises, é também para crescimento." },
  { img: instaSentir.url, alt: "Post: Entender o que você sente é o primeiro passo para mudar o que você vive." },
  { img: instaTraumas.url, alt: "Post: Traumas invisíveis — as dores que você aprendeu a esconder." },
];

export function InstagramSection() {
  return (
    <section className="border-t border-border/70 bg-paper py-20 sm:py-28">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal className="max-w-xl">
            <Eyebrow>Instagram</Eyebrow>
            <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl">
              Reflexões sobre saúde mental, comportamento e autoconhecimento.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("outline")}
            >
              <InstagramIcon className="size-4" />@{site.contact.instagramHandle}
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {POSTS.map((p, i) => (
            <Reveal key={p.img} delay={i * 120}>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-lg bg-muted"
                aria-label={`${p.alt} — ver no Instagram`}
              >
                <img
                  src={p.img}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  width={1080}
                  height={1350}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-elegant group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 flex items-end justify-end bg-navy/0 p-4 transition-colors duration-500 group-hover:bg-navy/25">
                  <span className="inline-flex size-10 translate-y-2 items-center justify-center rounded-full bg-ivory text-navy opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <InstagramIcon className="size-4" />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
