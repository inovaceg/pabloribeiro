import { ArrowUpRight, BadgeCheck, Check, Lock, MonitorSmartphone, ShieldCheck } from "lucide-react";

import { site, instagramUrl, hasText } from "@/config/site";
import { BOOKING_MESSAGES } from "@/lib/contact";
import { cn } from "@/lib/utils";
import instaCrescimento from "@/assets/instagram-psicoterapia.jpg";
import instaTraumas from "@/assets/instagram-traumas.jpg";
import instaSentir from "@/assets/instagram-sentimentos.jpg";
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

/** "How the first conversation works" panel: what happens + practical facts from site config. */
export function FirstConversation({ className }: { className?: string }) {
  const facts = [
    { label: "Modalidade", value: `Presencial em ${site.city} – ${site.state} ou online` },
    hasText(site.sessions.duration) ? { label: "Duração", value: site.sessions.duration } : null,
    hasText(site.sessions.pricing) ? { label: "Valores", value: site.sessions.pricing } : null,
    hasText(site.sessions.insurance) ? { label: "Convênios", value: site.sessions.insurance } : null,
    hasText(site.sessions.onlineCoverage) ? { label: "Online", value: site.sessions.onlineCoverage } : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <div className={cn("grid overflow-hidden rounded-2xl border border-border bg-paper lg:grid-cols-12", className)}>
      <div className="p-7 sm:p-10 lg:col-span-7">
        <Eyebrow>Primeira conversa</Eyebrow>
        <h3 className="mt-5 text-2xl leading-snug text-navy sm:text-3xl">Como funciona o primeiro encontro</h3>
        <ul className="mt-6 space-y-4">
          {[
            "Você conta, no seu ritmo, o que motivou a busca por atendimento — não é preciso chegar com tudo organizado.",
            "Conversamos sobre sua história, suas expectativas e o que você gostaria que mudasse.",
            "Eu explico como funciona o acompanhamento e indico o caminho mais adequado: psicoterapia, avaliação ou outro encaminhamento.",
            "Você tira suas dúvidas e decide, com tranquilidade, se quer seguir com o processo.",
          ].map((t) => (
            <li key={t} className="flex gap-3 leading-relaxed text-navy/80">
              <Check className="mt-1 size-4 shrink-0 text-sage" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative isolate flex flex-col justify-between gap-8 overflow-hidden bg-navy p-7 text-ivory sm:p-10 lg:col-span-5">
        <div aria-hidden className="absolute -right-20 -bottom-24 -z-10 size-64 rounded-full border border-sand/30" />
        <dl className="space-y-5">
          {facts.map((f) => (
            <div key={f.label} className="border-b border-ivory/15 pb-4">
              <dt className="text-xs font-semibold tracking-[0.14em] text-sand uppercase">{f.label}</dt>
              <dd className="mt-1.5 text-lg text-ivory">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm leading-relaxed text-ivory/70">
          O agendamento é feito diretamente comigo pelo WhatsApp, com retorno pessoal o mais breve possível.
        </p>
        <BookingButton variant="whatsapp" message={BOOKING_MESSAGES.agendamento} className="w-full py-4">
          Agendar a primeira conversa
        </BookingButton>
      </div>
    </div>
  );
}

/** Short ethics & confidentiality block with the CRP prominently displayed. */
export function EthicsSection() {
  const items = [
    {
      icon: Lock,
      title: "Sigilo profissional",
      text: "Tudo o que é conversado nas sessões é protegido pelo sigilo, conforme o Código de Ética Profissional do Psicólogo.",
    },
    {
      icon: MonitorSmartphone,
      title: "Atendimento online regulamentado",
      text: "As sessões online seguem as normas do Conselho Federal de Psicologia, com o mesmo cuidado do presencial.",
    },
    {
      icon: ShieldCheck,
      title: "Proteção dos seus dados",
      text: "Este site não armazena dados pessoais nem informações de saúde. O contato acontece diretamente pelo WhatsApp.",
    },
  ];
  return (
    <section className="bg-sage-soft/50 py-16 sm:py-20">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-4">
          <Eyebrow>Ética e sigilo</Eyebrow>
          <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl">Cuidado com responsabilidade.</h2>
          <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-navy/15 bg-paper px-5 py-3.5">
            <BadgeCheck className="size-6 text-sage" strokeWidth={1.5} aria-hidden />
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold text-navy">{site.crp}</p>
              <p className="text-xs text-muted-foreground">Conselho Regional de Psicologia – MG</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Registro consultável no{" "}
            <a
              href="https://cadastro.cfp.org.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy underline underline-offset-4"
            >
              Cadastro Nacional de Psicólogos
            </a>
            .
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 90} className="rounded-2xl bg-paper p-6">
              <it.icon className="size-6 text-sage" strokeWidth={1.4} aria-hidden />
              <h3 className="mt-4 text-xl leading-snug text-navy">{it.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{it.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const POSTS = [
  { img: instaCrescimento, alt: "Post: Psicoterapia não é só para crises, é também para crescimento." },
  { img: instaSentir, alt: "Post: Entender o que você sente é o primeiro passo para mudar o que você vive." },
  { img: instaTraumas, alt: "Post: Traumas invisíveis — as dores que você aprendeu a esconder." },
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
