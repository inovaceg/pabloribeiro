import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, MonitorSmartphone, Users } from "lucide-react";

import retratoEstudio from "@/assets/pablo_retrato_estudio.jpg.asset.json";
import retratoConsultorio from "@/assets/pablo_retrato_consultorio.jpg.asset.json";
import { site, instagramUrl } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { BookingButton, buttonClass } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, NumberedItem, SectionHeading } from "@/components/site/primitives";
import { CtaBand, InstagramSection } from "@/components/site/sections";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Psychologist",
  name: "Pablo Ribeiro — Psicólogo",
  description:
    "Psicoterapia em Terapia Cognitivo-Comportamental e Avaliação Neuropsicológica. Atendimento presencial em Juiz de Fora – MG e online.",
  areaServed: [{ "@type": "City", name: "Juiz de Fora" }, "Online"],
  address: { "@type": "PostalAddress", addressLocality: "Juiz de Fora", addressRegion: "MG", addressCountry: "BR" },
  sameAs: [instagramUrl],
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({
      title: "Pablo Ribeiro | Psicólogo em Juiz de Fora – MG · TCC e Avaliação Neuropsicológica",
      description:
        "Psicólogo em Juiz de Fora – MG (CRP 04/53880). Terapia Cognitivo-Comportamental e Avaliação Neuropsicológica, com atendimento presencial e online para todas as idades.",
      path: "/",
    }),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
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

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pt-44 lg:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 -left-40 size-[30rem] rounded-full bg-sage-soft blur-3xl"
      />
      <div className="container-site relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Psicólogo em {site.city} · Presencial e online</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-7 text-[2.55rem] leading-[1.06] text-navy sm:text-6xl lg:text-[4.6rem]">
              Cuidar da saúde mental é também{" "}
              <em className="font-light text-sage italic">compreender a si mesmo.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Um espaço de acolhimento, escuta e acompanhamento psicológico, com atendimento
              presencial em Juiz de Fora e modalidade online.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <BookingButton>Agendar atendimento</BookingButton>
              <Link to="/sobre" className={buttonClass("outline")}>
                Conheça meu trabalho
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-12 flex items-center gap-5 border-t border-navy/15 pt-6">
              <div>
                <p className="font-display text-xl text-navy">{site.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {site.role} <span className="mx-1.5 text-sand">|</span> {site.crp}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div aria-hidden className="absolute -top-5 -right-5 bottom-10 left-10 rounded-t-[12rem] rounded-b-lg border border-sand/60" />
          <div className="relative overflow-hidden rounded-t-[12rem] rounded-b-lg bg-sand-soft shadow-soft">
            <img
              src={retratoEstudio.url}
              alt="Pablo Ribeiro, psicólogo, em retrato profissional"
              width={1122}
              height={1402}
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 rounded-lg bg-paper px-5 py-4 shadow-soft sm:-left-8">
            <p className="eyebrow text-sage">Atendimento</p>
            <p className="mt-1.5 font-display text-lg text-navy">Presencial & online</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="overflow-hidden rounded-xl">
            <img
              src={retratoConsultorio.url}
              alt="Pablo Ribeiro no consultório"
              width={1774}
              height={887}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-[78%_center] sm:aspect-[16/10]"
            />
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <SectionHeading
            eyebrow="Apresentação"
            title={
              <>
                Escuta atenta, método e <em className="text-sage italic">respeito</em> à história de cada pessoa.
              </>
            }
          />
          <Reveal delay={100}>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Sou Pablo Ribeiro, psicólogo ({site.crp}). Atuo com Terapia Cognitivo-Comportamental
              e Avaliação Neuropsicológica, atendendo pessoas de todas as idades em {site.city} e
              também na modalidade online.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Meu trabalho é oferecer um espaço seguro, ético e acolhedor, em que seja possível
              compreender o que se sente, refletir sobre padrões e construir novas formas de lidar
              com os desafios.
            </p>
            <Link to="/sobre" className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-navy">
              <span className="border-b border-sand pb-0.5">Conheça minha trajetória</span>
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
      title: "Terapia Cognitivo-Comportamental",
      text: "Uma abordagem colaborativa que investiga a relação entre pensamentos, emoções e comportamentos, com foco na construção de recursos para lidar com as situações do dia a dia.",
      to: "/psicoterapia" as const,
      cta: "Sobre a psicoterapia",
    },
    {
      n: "02",
      title: "Avaliação Neuropsicológica",
      text: "Um processo estruturado de investigação das funções cognitivas, emocionais e comportamentais, que contribui para compreender o funcionamento de cada pessoa e orientar condutas.",
      to: "/avaliacao-neuropsicologica" as const,
      cta: "Sobre a avaliação",
    },
  ];
  return (
    <section className="bg-navy py-20 text-ivory sm:py-28">
      <div className="container-site">
        <SectionHeading
          tone="inverse"
          eyebrow="Áreas de atuação"
          title="Dois caminhos complementares de cuidado."
          intro="Psicoterapia e avaliação respondem a necessidades diferentes — e, em muitos casos, se complementam."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {areas.map((a, i) => (
            <Reveal key={a.n} delay={i * 120}>
              <Link
                to={a.to}
                className="group flex h-full flex-col rounded-xl border border-ivory/12 bg-ivory/[0.03] p-8 transition-all duration-700 ease-elegant hover:border-sand/50 hover:bg-ivory/[0.06] sm:p-10"
              >
                <span className="font-display text-5xl font-light text-sand/80 italic">{a.n}</span>
                <h3 className="mt-8 text-2xl text-ivory sm:text-3xl">{a.title}</h3>
                <p className="mt-4 flex-1 leading-relaxed text-ivory/70">{a.text}</p>
                <span className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-ivory">
                  {a.cta}
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
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
    {
      icon: MapPin,
      title: "Presencial",
      text: `Atendimento em consultório em ${site.city} – ${site.state}, em um ambiente reservado e acolhedor.`,
    },
    {
      icon: MonitorSmartphone,
      title: "Online",
      text: "Sessões por videochamada, com o mesmo cuidado ético e sigilo, onde você estiver.",
    },
    {
      icon: Users,
      title: "Todas as idades",
      text: "Acompanhamento para crianças, adolescentes, adultos e idosos, respeitando cada fase da vida.",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading
            className="lg:col-span-5"
            eyebrow="Modalidades"
            title="Atendimento presencial em Juiz de Fora e online."
          />
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            {items.map((it, i) => (
              <Reveal key={it.title} delay={i * 100}>
                <it.icon className="size-6 text-sage" strokeWidth={1.4} aria-hidden />
                <h3 className="mt-5 text-xl text-navy">{it.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted-foreground">{it.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="mt-14">
          <Link to="/atendimento" className="group inline-flex items-center gap-2 text-sm font-medium text-navy">
            <span className="border-b border-sand pb-0.5">Como funciona o atendimento</span>
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
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
    <section className="border-y border-border/70 bg-sand-soft/50 py-20 sm:py-28">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow>Por que fazer acompanhamento</Eyebrow>
          <blockquote className="mt-7">
            <p className="font-display text-3xl leading-[1.2] font-light text-navy sm:text-4xl">
              “Psicoterapia não é só para crises, é também para{" "}
              <em className="text-sage">crescimento.</em>”
            </p>
          </blockquote>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Buscar acompanhamento psicológico é um gesto de cuidado. Não é preciso esperar que algo
            esteja muito difícil para começar.
          </p>
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
    ["Entre em contato", "Envie uma mensagem pelos botões de agendamento ou pelo formulário de contato."],
    ["Primeira conversa", "Um momento de escuta para entender sua demanda e explicar como funciona o processo."],
    ["Acompanhamento", "Definimos juntos a modalidade, a frequência e os próximos passos."],
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-site">
        <SectionHeading
          align="center"
          eyebrow="Como começar"
          title="O primeiro passo pode ser simples."
        />
        <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 120} className="relative text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-sand font-display text-xl text-navy italic">
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl text-navy">{t}</h3>
              <p className="mx-auto mt-3 max-w-xs leading-relaxed text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
