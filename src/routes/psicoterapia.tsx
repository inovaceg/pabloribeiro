import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { site } from "@/config/site";
import { BOOKING_MESSAGES } from "@/lib/contact";
import { pageHead } from "@/lib/seo";
import { BookingButton, buttonClass } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { NumberedItem, PageHero, SectionHeading } from "@/components/site/primitives";
import { CtaBand } from "@/components/site/sections";

const MSG = BOOKING_MESSAGES.psicoterapia;

export const Route = createFileRoute("/psicoterapia")({
  head: () =>
    pageHead({
      title: "Psicoterapia e Terapia Cognitivo-Comportamental em Juiz de Fora | Pablo Ribeiro",
      description:
        "Psicoterapia em Terapia Cognitivo-Comportamental (TCC) com Pablo Ribeiro, psicólogo em Juiz de Fora – MG. Entenda como funciona o acompanhamento, presencial e online.",
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
          className={`absolute rounded-full border border-navy/15 bg-paper px-3.5 py-2 font-display text-sm text-navy shadow-soft sm:px-4 sm:py-2.5 sm:text-lg ${n.cls}`}
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
        <BookingButton message={MSG}>Agendar atendimento</BookingButton>
      </PageHero>

      {/* O que é psicoterapia */}
      <section className="py-20 sm:py-28">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-14">
          <SectionHeading className="lg:col-span-5" eyebrow="O que é" title="Psicoterapia" />
          <Reveal delay={100} className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:col-span-7">
            <p>
              Psicoterapia é um acompanhamento psicológico em que você encontra um espaço seguro e
              sigiloso para falar sobre o que sente, pensa e vive — e para compreender melhor a si
              mesmo.
            </p>
            <p>
              Ao longo dos encontros, construímos juntos novas formas de olhar para as situações e de
              lidar com os desafios, respeitando o seu tempo e a sua história.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TCC */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Terapia Cognitivo-Comportamental"
              title="Pensamentos, emoções e comportamentos se influenciam."
            />
            <Reveal delay={100} className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                A TCC parte de uma ideia central: a forma como interpretamos as situações influencia o
                que sentimos e como agimos.
              </p>
              <p>
                Em conjunto, paciente e psicólogo identificam padrões que geram sofrimento e
                desenvolvem, passo a passo, maneiras mais flexíveis de lidar com as experiências. É
                uma abordagem colaborativa, estruturada e com objetivos definidos ao longo do
                processo.
              </p>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <Triad />
          </Reveal>
        </div>
      </section>

      {/* Para quem */}
      <section className="py-20 sm:py-28">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-14">
          <SectionHeading
            className="lg:col-span-5"
            eyebrow="Para quem é indicado"
            title="Para pessoas de todas as idades."
            intro="Não é preciso estar em crise para buscar psicoterapia. Ela pode ajudar quem deseja:"
          />
          <Reveal delay={100} className="lg:col-span-7">
            <ul className="divide-y divide-navy/10 border-y border-navy/10">
              {[
                "Compreender melhor emoções, pensamentos e reações",
                "Lidar com ansiedade, estresse ou momentos de sofrimento",
                "Atravessar mudanças, perdas ou novos ciclos da vida",
                "Refletir sobre relações pessoais, familiares ou profissionais",
                "Investir em autoconhecimento e bem-estar emocional",
              ].map((t) => (
                <li key={t} className="flex items-start gap-4 py-4 text-navy">
                  <span aria-hidden className="mt-3 h-px w-5 shrink-0 bg-sand" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Primeira consulta e acompanhamento */}
      <section className="bg-navy py-20 text-ivory sm:py-28">
        <div className="container-site">
          <SectionHeading
            tone="inverse"
            eyebrow="Como acontece"
            title="Da primeira consulta ao acompanhamento."
          />
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Primeira consulta", "Um momento de acolhimento para conversar sobre o que motivou a busca, suas expectativas e tirar dúvidas sobre o processo."],
              ["Objetivos", "Juntos, definimos focos de trabalho possíveis, revisitados ao longo do caminho."],
              ["Sessões", "Encontros regulares, com espaço para fala livre, reflexão e desenvolvimento de estratégias para o dia a dia."],
              ["Revisão contínua", "O processo é acompanhado de perto e ajustado conforme as suas necessidades."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 100}>
                <NumberedItem tone="inverse" index={i + 1} title={t}>{d}</NumberedItem>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 max-w-2xl text-sm leading-relaxed text-ivory/60">
            Cada processo tem seu próprio ritmo e não há resultados garantidos: o que se oferece é um
            espaço seguro e ético para compreender as próprias experiências. Tudo o que é
            compartilhado em sessão é protegido pelo sigilo profissional.
          </Reveal>
        </div>
      </section>

      {/* Modalidades */}
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
            <BookingButton message={MSG}>Agendar atendimento</BookingButton>
            <Link to="/atendimento" className={buttonClass("outline")}>
              Detalhes do atendimento <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand message={MSG} />
    </>
  );
}
