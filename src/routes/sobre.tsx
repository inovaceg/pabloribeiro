import { createFileRoute } from "@tanstack/react-router";

import retratoEstudio from "@/assets/pablo_retrato_estudio.jpg.asset.json";
import retratoConsultorio from "@/assets/pablo_retrato_consultorio.jpg.asset.json";
import { site, hasText, SITE_URL } from "@/config/site";
import { BOOKING_MESSAGES } from "@/lib/contact";
import { pageHead } from "@/lib/seo";
import { BookingButton } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, SectionHeading } from "@/components/site/primitives";
import { CtaBand } from "@/components/site/sections";

export const Route = createFileRoute("/sobre")({
  head: () =>
    pageHead({
      title: "Sobre Pablo Ribeiro | Psicólogo em Juiz de Fora – CRP 04/53880",
      description:
        "Conheça Pablo Ribeiro, psicólogo em Juiz de Fora – MG. Psicoterapia, Terapia Cognitivo-Comportamental e Avaliação Neuropsicológica, presencial e online.",
      path: "/sobre",
      image: `${SITE_URL}${retratoEstudio.url}`,
    }),
  component: AboutPage,
});

const CREDENTIALS = [
  { title: "Formação acadêmica", items: site.about.education },
  { title: "Especializações", items: site.about.specializations },
  { title: "Experiência profissional", items: site.about.experience },
].filter((c) => hasText(c.items));

function AboutPage() {
  return (
    <>
      {/* Apresentação */}
      <section className="relative isolate overflow-hidden bg-navy pt-28 pb-16 text-ivory sm:pt-40 lg:pb-28">
        <div aria-hidden className="grain-layer absolute inset-0 -z-10" />
        <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[34rem] rounded-full bg-sage/20 blur-3xl" />
        <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:col-span-7">
            <Eyebrow className="text-sand">Sobre o profissional</Eyebrow>
            <h1 className="mt-6 text-[2.5rem] leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
              Conheça <em className="font-light text-sage italic">Pablo Ribeiro</em>
            </h1>
            <p className="mt-6 text-sm text-ivory/75">
              {site.role} <span className="mx-1.5 text-sand">|</span> {site.crp}
            </p>
            <div className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-ivory/75">
              {hasText(site.about.bio) ? (
                site.about.bio.map((p) => <p key={p}>{p}</p>)
              ) : (
                <>
                  <p>
                    Sou psicólogo e atuo com psicoterapia, a partir da Terapia
                    Cognitivo-Comportamental, e com Avaliação Neuropsicológica.
                  </p>
                  <p>
                    Atendo pessoas de todas as idades, presencialmente em {site.city} – {site.state}{" "}
                    e também na modalidade online.
                  </p>
                </>
              )}
            </div>
            <div className="mt-10">
              <BookingButton variant="whatsapp" message={BOOKING_MESSAGES.agendamento}>Agendar atendimento</BookingButton>
            </div>
          </Reveal>
          <Reveal delay={150} className="order-1 mx-auto w-full max-w-xs sm:max-w-sm lg:order-2 lg:col-span-5 lg:max-w-none">
            <div className="overflow-hidden rounded-t-[12rem] rounded-b-xl bg-sand-soft shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-sand/40">
              <img
                src={retratoEstudio.url}
                alt="Retrato profissional de Pablo Ribeiro, psicólogo"
                width={1122}
                height={1402}
                fetchPriority="high"
                className="aspect-[4/5] w-full object-cover object-[50%_15%]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Abordagem e filosofia */}
      <section className="py-20 sm:py-28">
        <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Abordagem de trabalho"
              title="Cuidado ético, escuta e construção conjunta."
            />
            <Reveal delay={100} className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
              <p>
                Cada pessoa carrega uma história única. Por isso, o acompanhamento é construído de
                forma individualizada, respeitando o tempo, os valores e os objetivos de quem busca
                ajuda.
              </p>
              <p>
                O trabalho se apoia no sigilo profissional, no compromisso ético com a Psicologia e
                em uma relação de confiança — base de qualquer processo terapêutico.
              </p>
            </Reveal>
            <Reveal delay={180} className="mt-10 border-t border-navy/15 pt-8">
              <h3 className="text-2xl text-navy">Terapia Cognitivo-Comportamental</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Uma abordagem colaborativa e estruturada, que compreende a relação entre
                pensamentos, emoções e comportamentos e busca desenvolver recursos práticos para o
                dia a dia.
              </p>
            </Reveal>
          </div>
          <Reveal delay={120} className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <img
                src={retratoConsultorio.url}
                alt="Pablo Ribeiro em seu consultório"
                width={1774}
                height={887}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover object-[76%_30%]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Formação — exibida apenas quando confirmada pelo profissional */}
      {CREDENTIALS.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="container-site">
            <SectionHeading eyebrow="Formação" title="Formação e experiência" />
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {CREDENTIALS.map((col, i) => (
                <Reveal key={col.title} delay={i * 100} className="border-t border-navy/15 pt-6">
                  <h3 className="mb-5 text-2xl text-navy">{col.title}</h3>
                  <ul className="space-y-3">
                    {col.items.map((it) => (
                      <li key={it} className="flex gap-3 leading-relaxed text-muted-foreground">
                        <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-sand" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
