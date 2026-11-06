import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardList, MessageSquareMore, MessagesSquare, MonitorSmartphone } from "lucide-react";

import retratoConsultorio from "@/assets/pablo_retrato_consultorio.jpg.asset.json";
import retratoBanner from "@/assets/retrato-banner.png";
import { site, instagramUrl, SITE_URL } from "@/config/site";
import { BOOKING_MESSAGES } from "@/lib/contact";
import { pageHead } from "@/lib/seo";
import { BookingButton } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, NumberedItem, SectionHeading } from "@/components/site/primitives";
import { EthicsSection, FirstConversation, InstagramSection } from "@/components/site/sections";
import { ArticleCard } from "@/components/site/articles";
import { JsonLd } from "@/components/site/JsonLd";
import { publishedArticlesQuery } from "@/lib/articles.queries";

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
  address: { "@type": "PostalAddress", streetAddress: "Rua Dr. Constantino Paleta, 171 – Sala 201", postalCode: "36015-450", addressLocality: "Juiz de Fora", addressRegion: "MG", addressCountry: "BR" },
  knowsAbout: ["Psicoterapia", "Terapia Cognitivo-Comportamental", "Avaliação Neuropsicológica"],
  sameAs: [instagramUrl, site.contact.googleBusinessUrl].filter(Boolean),
};

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedArticlesQuery()),
  head: () => pageHead({
    title: "Pablo Ribeiro | Psicólogo em Juiz de Fora – MG · Psicoterapia e Avaliação Neuropsicológica",
    description:
      "Psicólogo em Juiz de Fora – MG (CRP 04/53880). Psicoterapia em Terapia Cognitivo-Comportamental e Avaliação Neuropsicológica, com atendimento presencial e online para todas as idades.",
    path: "/",
    image: HERO_IMAGE,
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero />
      <HighlightsStrip />
      <HowICanHelp />
      <ListeningRow />
      <WhyTherapy />
      <HowToStart />
      <EthicsSection />
      <ArticlesTeaser />
      <InstagramSection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory pt-[76px] sm:pt-20">
      {/* Photo: stacked on mobile, full-bleed background on desktop */}
      <div className="relative lg:absolute lg:inset-0 lg:top-20">
        <img
          src={retratoBanner}
          alt="Pablo Ribeiro, psicólogo, em retrato editorial"
          width={1774}
          height={887}
          fetchPriority="high"
          className="h-[19rem] w-full object-cover object-[74%_24%] sm:h-[26rem] md:h-[30rem] lg:h-full lg:object-[72%_38%]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ivory to-transparent lg:hidden" />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-r from-ivory from-[35%] via-ivory/70 via-[49%] to-transparent to-[68%] lg:block"
        />
      </div>

      <div className="container-site relative pb-14 lg:py-28 xl:py-32">
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-navy/80">
              <span aria-hidden className="h-[3px] w-10 rounded-full bg-sand" />
              Psicologia • {site.city} – {site.state}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-[2.35rem] leading-[1.08] font-semibold text-navy sm:text-5xl lg:text-[3.6rem]">
              Cuidar da saúde mental é também compreender a si mesmo.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-navy/75">
              Atendimento psicológico presencial em Juiz de Fora – MG e online, com acolhimento,
              escuta qualificada e acompanhamento individualizado.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <BookingButton
                message={BOOKING_MESSAGES.agendamento}
                className="rounded-xl px-7 py-4 text-base font-semibold"
              >
                Agendar atendimento
              </BookingButton>
              <Link
                to="/sobre"
                className="self-center border-b-2 border-sage pb-1 font-semibold text-navy/85 transition-colors hover:border-navy hover:text-navy sm:self-auto"
              >
                Conheça meu trabalho
              </Link>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-10 text-sm text-navy/70">
              <span className="font-display text-base font-semibold text-navy">{site.name}</span>
              <span className="mx-2 text-sand">|</span>
              {site.role} · {site.crp} · Todas as idades
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HighlightsStrip() {
  const items = [
    { icon: MonitorSmartphone, label: "Atendimento presencial e online" },
    { icon: MessagesSquare, label: "Terapia Cognitivo-Comportamental" },
    { icon: ClipboardList, label: "Avaliação Neuropsicológica" },
  ];
  return (
    <div className="bg-sage text-paper">
      <ul className="container-site grid divide-y divide-paper/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-3.5 py-4 sm:justify-center sm:px-4 sm:py-5">
            <it.icon className="size-6 shrink-0" strokeWidth={1.3} aria-hidden />
            <span className="text-[0.95rem] font-medium">{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HowICanHelp() {
  const cards = [
    {
      icon: MessageSquareMore,
      title: "Psicoterapia",
      text: "Um processo de acompanhamento para compreender emoções, padrões de pensamento e formas de agir, com base na Terapia Cognitivo-Comportamental.",
      to: "/psicoterapia" as const,
    },
    {
      icon: ClipboardList,
      title: "Avaliação Neuropsicológica",
      text: "Investigação das funções cognitivas, emocionais e comportamentais, contribuindo para uma compreensão mais ampla do funcionamento de cada pessoa.",
      to: "/avaliacao-neuropsicologica" as const,
    },
  ];
  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="container-site">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold text-navy sm:text-[2.6rem]">Como posso ajudar?</h2>
          <span aria-hidden className="mx-auto mt-5 block h-[3px] w-12 rounded-full bg-sand" />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 120}>
              <Link
                to={c.to}
                className="group flex h-full flex-col gap-5 rounded-2xl border border-border bg-paper/60 p-6 transition-all duration-500 ease-elegant hover:-translate-y-1 hover:border-sage/60 hover:bg-paper hover:shadow-soft sm:flex-row sm:p-7"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-sage/30 bg-sage-soft text-navy sm:size-16">
                  <c.icon className="size-7" strokeWidth={1.3} aria-hidden />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-2xl font-semibold text-navy">{c.title}</span>
                  <span className="mt-2 leading-relaxed text-navy/75">{c.text}</span>
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold text-navy">
                    Saiba mais
                    <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ListeningRow() {
  return (
    <section className="bg-sand-soft/40 py-16 sm:py-20">
      <div className="container-site grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-12">
        <Reveal className="flex flex-col justify-center md:col-span-2 lg:col-span-4 lg:pr-6">
          <h2 className="text-3xl leading-[1.12] font-semibold text-navy sm:text-[2.2rem]">
            Um espaço de escuta, acolhimento e desenvolvimento.
          </h2>
          <span aria-hidden className="mt-6 block h-[3px] w-12 rounded-full bg-sand" />
          <p className="mt-6 leading-relaxed text-navy/75">
            Atendimento psicológico pautado na escuta qualificada, no respeito à sua história e na
            construção de estratégias que façam sentido para a sua vida.
          </p>
          <Link to="/sobre" className="group mt-6 inline-flex items-center gap-2 font-semibold text-navy">
            Conheça Pablo Ribeiro
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-4">
          <div className="h-full overflow-hidden rounded-2xl">
            <img
              src={retratoConsultorio.url}
              alt="Retrato de Pablo Ribeiro no consultório"
              width={1774}
              height={887}
              loading="lazy"
              className="aspect-[4/5] h-full w-full object-cover object-[74%_25%] md:aspect-auto md:min-h-80"
            />
          </div>
        </Reveal>
        <Reveal delay={180} className="lg:col-span-4">
          <div className="relative isolate flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-navy p-8 text-ivory sm:p-10">
            <div aria-hidden className="absolute -top-24 -right-24 -z-10 size-48 rounded-full border border-sand/60" />
            <h2 className="text-3xl font-semibold text-ivory sm:text-[2.1rem]">Vamos conversar?</h2>
            <p className="mt-4 text-lg leading-relaxed text-ivory/80">
              Entre em contato pelo WhatsApp, tire suas dúvidas e agende seu atendimento.
            </p>
            <BookingButton
              message={BOOKING_MESSAGES.agendamento}
              className="mt-8 rounded-xl bg-sage py-4 font-semibold text-paper hover:bg-sage/90"
            >
              Entrar em contato pelo WhatsApp
            </BookingButton>
          </div>
        </Reveal>
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
        <Reveal className="mt-16">
          <FirstConversation />
        </Reveal>
      </div>
    </section>
  );
}

function ArticlesTeaser() {
  const { data: articles } = useSuspenseQuery(publishedArticlesQuery());
  if (articles.length === 0) return null;
  return (
    <section className="py-20 sm:py-28">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Artigos" title="Informação para compreender e cuidar." />
          <Reveal>
            <Link to="/artigos" className="group inline-flex items-center gap-2 font-semibold text-navy">
              Ver todos os artigos
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
