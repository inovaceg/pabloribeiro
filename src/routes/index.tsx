import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, MapPin, MonitorSmartphone, Users, BadgeCheck } from "lucide-react";

import retratoEstudio from "@/assets/pablo_retrato_estudio.jpg.asset.json";
import retratoConsultorio from "@/assets/pablo_retrato_consultorio.jpg.asset.json";
import { site, instagramUrl, SITE_URL } from "@/config/site";
import { BOOKING_MESSAGES } from "@/lib/contact";
import { pageHead } from "@/lib/seo";
import { BookingButton, buttonClass } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, NumberedItem, SectionHeading } from "@/components/site/primitives";
import { CtaBand, InstagramSection } from "@/components/site/sections";

const HERO_IMAGE = `${SITE_URL}${retratoConsultorio.url}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Psychologist",
  name: "Pablo Ribeiro — Psicólogo",
  url: SITE_URL,
  image: HERO_IMAGE,
  telephone: "+55 32 98841-1284",
  description:
    "Psicoterapia, Terapia Cognitivo-Comportamental e Avaliação Neuropsicológica. Atendimento presencial em Juiz de Fora – MG e online.",
  areaServed: [{ "@type": "City", name: "Juiz de Fora" }, { "@type": "Country", name: "Brasil" }],
  address: { "@type": "PostalAddress", addressLocality: "Juiz de Fora", addressRegion: "MG", addressCountry: "BR" },
  knowsAbout: ["Psicoterapia", "Terapia Cognitivo-Comportamental", "Avaliação Neuropsicológica"],
  sameAs: [instagramUrl],
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({
      title: "Pablo Ribeiro | Psicólogo em Juiz de Fora – MG · Psicoterapia e Avaliação Neuropsicológica",
      description:
        "Psicólogo em Juiz de Fora – MG (CRP 04/53880). Psicoterapia em Terapia Cognitivo-Comportamental e Avaliação Neuropsicológica, com atendimento presencial e online para todas as idades.",
      path: "/",
      image: HERO_IMAGE,
    }),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Intro />
      <Areas />
      <Modalities />
      <WhyTherapy />
      <HowToStart />
      <InstagramSection />
      <CtaBand />
    </>
  );
}

function RotatingSeal() {
  const text = "PRESENCIAL · ONLINE · JUIZ DE FORA · TODAS AS IDADES · ";
  return (
    <div className="relative size-28 sm:size-32" aria-hidden>
      <svg viewBox="0 0 120 120" className="absolute inset-0 animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id="seal-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-ivory text-[8.6px] font-semibold tracking-[0.2em]">
          <textPath href="#seal-circle">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-sand font-display text-xl text-navy italic">
        PR
      </div>
    </div>
  );
}

function Hero() {
  const credentials = [
    { icon: BadgeCheck, label: `${site.role} · ${site.crp}` },
    { icon: MapPin, label: `Presencial em ${site.city}` },
    { icon: MonitorSmartphone, label: "Atendimento online" },
    { icon: Users, label: "Todas as idades" },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-navy pt-28 pb-16 text-ivory sm:pt-36 lg:pt-40 lg:pb-24">
      <div aria-hidden className="grain-layer absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[34rem] rounded-full bg-sage/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-[-10%] bottom-[-20%] -z-10 size-[40rem] rounded-full bg-sand/10 blur-3xl" />

      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow className="text-sand">Psicólogo em {site.city} – {site.state}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-7 text-[2.4rem] leading-[1.06] text-ivory sm:text-6xl lg:text-[4.3rem]">
              Um espaço para compreender suas emoções e{" "}
              <em className="font-light text-sage italic">cuidar da sua saúde mental.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/75">
              Atendimento psicológico presencial em Juiz de Fora – MG e online, com acolhimento,
              escuta qualificada e acompanhamento individualizado.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <BookingButton variant="whatsapp" message={BOOKING_MESSAGES.agendamento} className="py-4 sm:px-7">
                Agendar atendimento
              </BookingButton>
              <Link
                to="/sobre"
                className={buttonClass(
                  "outline",
                  "border-ivory/30 py-4 text-ivory hover:border-ivory hover:bg-ivory/10 sm:px-7",
                )}
              >
                Conheça meu trabalho
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ivory/15 pt-7 sm:flex sm:flex-wrap sm:gap-x-8">
              {credentials.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5 text-sm text-ivory/80">
                  <c.icon className="size-4 shrink-0 text-sand" strokeWidth={1.6} aria-hidden />
                  {c.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:col-span-5 lg:max-w-none lg:pl-6">
          <div aria-hidden className="absolute -top-4 -right-4 bottom-12 left-10 rounded-t-[14rem] rounded-b-xl border border-sand/50 lg:left-16" />
          <div className="relative overflow-hidden rounded-t-[14rem] rounded-b-xl bg-sand-soft shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
            <img
              src={retratoEstudio.url}
              alt="Pablo Ribeiro, psicólogo, em retrato profissional"
              width={1122}
              height={1402}
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover object-[50%_12%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/50 to-transparent px-6 pt-20 pb-6">
              <p className="font-display text-2xl text-ivory sm:text-3xl">{site.name}</p>
              <p className="mt-1 text-sm text-ivory/80">
                {site.role} <span className="mx-1.5 text-sand">|</span> {site.crp}
              </p>
            </div>
          </div>
          <div className="absolute -top-6 -left-4 sm:-left-10 lg:-left-6">
            <RotatingSeal />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Psicoterapia", "Terapia Cognitivo-Comportamental", "Avaliação Neuropsicológica", "Presencial em Juiz de Fora", "Atendimento online", "Todas as idades"];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-sand/40 bg-sand-soft py-5" aria-label="Áreas de atuação">
      <div className="flex w-max animate-marquee">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 font-display text-xl whitespace-nowrap text-navy/80 italic sm:text-2xl" aria-hidden={i >= items.length}>
            {t}
            <span className="size-1.5 rounded-full bg-sage" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

function Intro() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative lg:col-span-6">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={retratoConsultorio.url}
              alt="Pablo Ribeiro no consultório"
              width={1774}
              height={887}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-[76%_30%] sm:aspect-[5/4]"
            />
          </div>
          <figure className="absolute right-4 -bottom-8 left-4 rounded-xl bg-navy p-6 text-ivory shadow-soft sm:right-auto sm:-bottom-10 sm:left-auto sm:-right-6 sm:max-w-xs lg:-right-10">
            <blockquote className="font-display text-lg leading-snug italic">
              “Entender o que você sente é o primeiro passo para mudar o que você vive.”
            </blockquote>
            <figcaption className="mt-3 text-xs tracking-[0.14em] text-sand uppercase">Pablo Ribeiro</figcaption>
          </figure>
        </Reveal>
        <div className="pt-6 lg:col-span-6 lg:pt-0">
          <SectionHeading
            eyebrow="Apresentação"
            title={
              <>
                Escuta atenta, método e <em className="text-sage italic">respeito</em> à história de cada pessoa.
              </>
            }
          />
          <Reveal delay={100}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Sou Pablo Ribeiro, psicólogo ({site.crp}). Atuo com psicoterapia, a partir da Terapia
              Cognitivo-Comportamental, e com Avaliação Neuropsicológica, atendendo pessoas de todas
              as idades em {site.city} e online.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Meu trabalho é oferecer um espaço seguro, ético e acolhedor, em que seja possível
              compreender o que se sente e construir novas formas de lidar com os desafios.
            </p>
            <Link to="/sobre" className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-navy">
              <span className="border-b border-sand pb-0.5">Conheça mais sobre mim</span>
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Areas() {
  const areas = [
    {
      n: "01",
      title: "Psicoterapia · TCC",
      text: "Uma abordagem colaborativa que investiga a relação entre pensamentos, emoções e comportamentos, com foco em recursos para lidar com o dia a dia.",
      to: "/psicoterapia" as const,
      tags: ["Adultos", "Adolescentes", "Crianças", "Idosos"],
    },
    {
      n: "02",
      title: "Avaliação Neuropsicológica",
      text: "Um processo estruturado de investigação das funções cognitivas, emocionais e comportamentais, que ajuda a compreender o funcionamento de cada pessoa.",
      to: "/avaliacao-neuropsicologica" as const,
      tags: ["Atenção", "Memória", "Linguagem", "Funções executivas"],
    },
  ];
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Áreas de atuação" title="Dois caminhos complementares de cuidado." />
          <Reveal delay={100}>
            <Link to="/atendimento" className={buttonClass("outline")}>
              Como funciona o atendimento <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {areas.map((a, i) => (
            <Reveal key={a.n} delay={i * 120}>
              <Link
                to={a.to}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-ivory p-8 transition-all duration-700 ease-elegant hover:-translate-y-1 hover:border-navy hover:bg-navy hover:shadow-soft sm:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-6xl font-light text-sand italic transition-colors duration-700">{a.n}</span>
                  <span className="flex size-12 items-center justify-center rounded-full border border-navy/15 text-navy transition-all duration-700 group-hover:rotate-45 group-hover:border-sand group-hover:bg-sand group-hover:text-navy">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
                <h3 className="mt-10 text-3xl text-navy transition-colors duration-700 group-hover:text-ivory sm:text-[2.1rem]">{a.title}</h3>
                <p className="mt-4 flex-1 leading-relaxed text-muted-foreground transition-colors duration-700 group-hover:text-ivory/70">{a.text}</p>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <li key={t} className="rounded-full border border-navy/15 px-3 py-1 text-xs text-navy/80 transition-colors duration-700 group-hover:border-ivory/20 group-hover:text-ivory/80">
                      {t}
                    </li>
                  ))}
                </ul>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modalities() {
  const items = [
    { icon: MapPin, title: "Presencial", text: `Consultório em ${site.city} – ${site.state}, em um ambiente reservado e acolhedor.` },
    { icon: MonitorSmartphone, title: "Online", text: "Sessões por videochamada, com o mesmo cuidado ético e sigilo, onde você estiver." },
    { icon: Users, title: "Todas as idades", text: "Acompanhamento para crianças, adolescentes, adultos e idosos." },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-navy py-20 text-ivory sm:py-28">
      <div aria-hidden className="grain-layer absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -bottom-40 -z-10 size-[30rem] rounded-full border border-sand/20" />
      <div className="container-site">
        <SectionHeading tone="inverse" eyebrow="Modalidades" title="Presencial em Juiz de Fora e online." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-ivory/10 sm:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 100} className="bg-navy p-8 sm:p-10">
              <span className="flex size-12 items-center justify-center rounded-full bg-ivory/5 ring-1 ring-sand/40">
                <it.icon className="size-5 text-sand" strokeWidth={1.5} aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl text-ivory">{it.title}</h3>
              <p className="mt-3 leading-relaxed text-ivory/70">{it.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyTherapy() {
  const points = [
    ["Autoconhecimento", "Compreender emoções, pensamentos e reações ajuda a fazer escolhas mais conscientes."],
    ["Momentos de transição", "Mudanças, perdas e novos ciclos podem ser vividos com mais suporte e clareza."],
    ["Relações", "Refletir sobre a forma como nos relacionamos com os outros — e conosco."],
    ["Bem-estar emocional", "Desenvolver recursos para lidar com ansiedade, estresse e situações difíceis."],
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow>Por que fazer acompanhamento</Eyebrow>
          <blockquote className="mt-7">
            <p className="font-display text-3xl leading-[1.2] font-light text-navy sm:text-[2.6rem]">
              “Psicoterapia não é só para crises, é também para{" "}
              <em className="text-sage">crescimento.</em>”
            </p>
          </blockquote>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Buscar acompanhamento psicológico é um gesto de cuidado. Não é preciso esperar que algo
            esteja muito difícil para começar.
          </p>
          <BookingButton message={BOOKING_MESSAGES.psicoterapia} className="mt-8">
            Quero conversar
          </BookingButton>
        </Reveal>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7">
          {points.map(([t, d], i) => (
            <Reveal key={t} delay={i * 90}>
              <NumberedItem index={i + 1} title={t}>
                {d}
              </NumberedItem>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowToStart() {
  const steps = [
    ["Envie uma mensagem", "Fale comigo pelo WhatsApp ou pelo formulário de contato."],
    ["Primeira conversa", "Um momento de escuta para entender sua demanda e explicar como funciona o processo."],
    ["Acompanhamento", "Definimos juntos a modalidade, a frequência e os próximos passos."],
  ];
  return (
    <section className="border-y border-border/70 bg-sand-soft/50 py-20 sm:py-28">
      <div className="container-site">
        <SectionHeading align="center" eyebrow="Como começar" title="O primeiro passo pode ser simples." />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8 md:before:absolute md:before:top-7 md:before:right-[16%] md:before:left-[16%] md:before:h-px md:before:bg-sand/60 md:before:content-['']">
          {steps.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 120} className="relative text-center">
              <span className="relative mx-auto flex size-14 items-center justify-center rounded-full bg-navy font-display text-xl text-ivory italic ring-8 ring-sand-soft">
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl text-navy">{t}</h3>
              <p className="mx-auto mt-3 max-w-xs leading-relaxed text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-14 flex justify-center">
          <BookingButton variant="whatsapp" message={BOOKING_MESSAGES.agendamento} className="py-4 sm:px-8">
            Agendar pelo WhatsApp
          </BookingButton>
        </Reveal>
      </div>
    </section>
  );
}
