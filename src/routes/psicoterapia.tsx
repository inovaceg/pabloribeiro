import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { site } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { BookingButton, buttonClass } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { NumberedItem, PageHero, SectionHeading } from "@/components/site/primitives";
import { CtaBand } from "@/components/site/sections";

export const Route = createFileRoute("/psicoterapia")({
  head: () =>
    pageHead({
      title: "Terapia Cognitivo-Comportamental em Juiz de Fora | Pablo Ribeiro, Psicólogo",
      description:
        "Psicoterapia em Terapia Cognitivo-Comportamental (TCC) com Pablo Ribeiro, psicólogo em Juiz de Fora – MG. Atendimento presencial e online.",
      path: "/psicoterapia",
    }),
  component: TherapyPage,
});

function Triad() {
  const nodes = [
    { label: "Pensamentos", cls: "left-1/2 top-0 -translate-x-1/2" },
    { label: "Emoções", cls: "left-0 bottom-0" },
    { label: "Comportamentos", cls: "right-0 bottom-0" },
  ];
  return (
    <div className="relative mx-auto aspect-[1.1] w-full max-w-md" role="img" aria-label="Relação entre pensamentos, emoções e comportamentos">
      <svg viewBox="0 0 220 200" className="absolute inset-0 h-full w-full text-sand" aria-hidden>
        <polygon points="110,30 30,170 190,170" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 4" />
        <circle cx="110" cy="122" r="26" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
      </svg>
      {nodes.map((n) => (
        <span
          key={n.label}
          className={`absolute rounded-full border border-navy/15 bg-paper px-4 py-2.5 font-display text-base text-navy shadow-soft sm:text-lg ${n.cls}`}
        >
          {n.label}
        </span>
      ))}
    </div>
  );
}

function TherapyPage() {
  return (
    <>
      <PageHero
        eyebrow="Psicoterapia · TCC"
        title={
          <>
            Um espaço para compreender, desenvolver e <em className="font-light text-sage italic">transformar.</em>
          </>
        }
        intro="A psicoterapia é um processo de cuidado que acontece no encontro entre paciente e psicólogo, com escuta qualificada, ética e respeito à singularidade de cada pessoa."
      >
        <BookingButton>Agendar atendimento</BookingButton>
      </PageHero>

      <section className="py-20 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <SectionHeading className="lg:col-span-5" eyebrow="O que é" title="Terapia Cognitivo-Comportamental" />
          <Reveal delay={100} className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:col-span-7">
            <p>
              A Terapia Cognitivo-Comportamental (TCC) é uma abordagem da Psicologia que parte de uma
              ideia central: a forma como interpretamos as situações influencia o que sentimos e como
              agimos.
            </p>
            <p>
              Na TCC, paciente e terapeuta trabalham juntos para identificar padrões de pensamento e
              comportamento que geram sofrimento, compreender sua origem e construir, passo a passo,
              formas mais flexíveis e funcionais de lidar com as experiências.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <div className="container-site grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Pensamentos, emoções e comportamentos"
              title="Três dimensões que se influenciam mutuamente."
              intro="Um pensamento pode despertar uma emoção, que leva a um comportamento — que, por sua vez, reforça o pensamento inicial. Compreender esse ciclo é um dos pontos de partida do trabalho em TCC."
            />
          </div>
          <Reveal delay={150}>
            <Triad />
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading eyebrow="Como funciona" title="O acompanhamento, passo a passo." />
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Acolhimento", "Os primeiros encontros são dedicados a compreender sua história, sua demanda e o que você espera do processo."],
              ["Objetivos", "Juntos, definimos focos de trabalho e metas possíveis, revisitadas ao longo do caminho."],
              ["Sessões", "Encontros estruturados, com espaço para fala livre, reflexão e desenvolvimento de estratégias para o dia a dia."],
              ["Revisão", "O processo é acompanhado continuamente, ajustando o planejamento conforme as necessidades."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 100}>
                <NumberedItem index={i + 1} title={t}>{d}</NumberedItem>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 text-ivory sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <SectionHeading
            tone="inverse"
            className="lg:col-span-5"
            eyebrow="O processo terapêutico"
            title="Cada processo tem seu próprio ritmo."
          />
          <Reveal delay={100} className="space-y-5 leading-relaxed text-ivory/75 lg:col-span-7">
            <p>
              A psicoterapia é construída de forma conjunta e contínua. A regularidade das sessões, o
              vínculo de confiança e o envolvimento de cada pessoa fazem parte do processo.
            </p>
            <p>
              Não existem fórmulas prontas nem resultados garantidos: o que se busca é oferecer um
              espaço seguro para compreender as próprias experiências e desenvolver novos recursos,
              no tempo de cada um.
            </p>
            <p className="text-sm text-ivory/55">
              Todas as informações compartilhadas em sessão são protegidas pelo sigilo profissional,
              conforme o Código de Ética Profissional do Psicólogo.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading eyebrow="Modalidades" title="Presencial ou online." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              ["Presencial", `Sessões no consultório em ${site.city} – ${site.state}, em um ambiente reservado e acolhedor.`],
              ["Online", "Sessões por videochamada, com o mesmo cuidado e sigilo, para quem prefere ou precisa da flexibilidade do atendimento a distância."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 100} className="rounded-xl border border-border bg-paper p-8 sm:p-10">
                <h3 className="text-2xl text-navy">{t}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
            <BookingButton>Agendar atendimento</BookingButton>
            <Link to="/atendimento" className={buttonClass("outline")}>
              Detalhes do atendimento <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
