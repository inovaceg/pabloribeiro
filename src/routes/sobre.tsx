import { createFileRoute } from "@tanstack/react-router";

import retratoEstudio from "@/assets/pablo_retrato_estudio.jpg.asset.json";
import retratoConsultorio from "@/assets/pablo_retrato_consultorio.jpg.asset.json";
import { site, hasText } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { BookingButton } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, PendingField, SectionHeading } from "@/components/site/primitives";
import { CtaBand } from "@/components/site/sections";

export const Route = createFileRoute("/sobre")({
  head: () =>
    pageHead({
      title: "Sobre Pablo Ribeiro | Psicólogo em Juiz de Fora – CRP 04/53880",
      description:
        "Conheça Pablo Ribeiro, psicólogo em Juiz de Fora – MG. Atuação em Terapia Cognitivo-Comportamental e Avaliação Neuropsicológica, presencial e online.",
      path: "/sobre",
    }),
  component: AboutPage,
});

function ListOrPending({ items, label, hint }: { items: readonly string[]; label: string; hint: string }) {
  if (!hasText(items)) return <PendingField label={label} hint={hint} />;
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it} className="flex gap-3 leading-relaxed text-muted-foreground">
          <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-sand" />
          {it}
        </li>
      ))}
    </ul>
  );
}

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
        <div className="container-site grid items-end gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Sobre</Eyebrow>
            <h1 className="mt-6 text-[2.6rem] leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
              Conheça <em className="font-light text-sage italic">Pablo Ribeiro</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Psicólogo ({site.crp}) com atuação em Terapia Cognitivo-Comportamental e Avaliação
              Neuropsicológica. Atendimento presencial em {site.city} – {site.state} e online, para
              pessoas de todas as idades.
            </p>
            <div className="mt-10">
              <BookingButton>Agendar atendimento</BookingButton>
            </div>
          </Reveal>
          <Reveal delay={150} className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
            <div className="overflow-hidden rounded-xl bg-sand-soft shadow-soft">
              <img
                src={retratoEstudio.url}
                alt="Retrato profissional de Pablo Ribeiro"
                width={1122}
                height={1402}
                fetchPriority="high"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <SectionHeading className="lg:col-span-4" eyebrow="Biografia" title="Trajetória profissional" />
          <Reveal delay={100} className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:col-span-8">
            {hasText(site.about.bio) ? (
              site.about.bio.map((p) => <p key={p}>{p}</p>)
            ) : (
              <PendingField
                label="Biografia profissional"
                hint="Espaço reservado para a apresentação da trajetória do Pablo, a ser escrita por ele."
              />
            )}
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading eyebrow="Formação" title="Formação e experiência" />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              { title: "Formação acadêmica", items: site.about.education, hint: "Graduação e demais formações, a serem informadas pelo profissional." },
              { title: "Especializações", items: site.about.specializations, hint: "Especializações e cursos, a serem informados pelo profissional." },
              { title: "Experiência profissional", items: site.about.experience, hint: "Experiências e áreas de atuação anteriores, a serem informadas pelo profissional." },
            ].map((col, i) => (
              <Reveal key={col.title} delay={i * 100} className="border-t border-navy/15 pt-6">
                <h3 className="mb-6 text-2xl text-navy">{col.title}</h3>
                <ListOrPending items={col.items} label={col.title} hint={col.hint} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 text-ivory sm:py-28">
        <div className="container-site grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              tone="inverse"
              eyebrow="Filosofia de trabalho"
              title="Cuidado ético, escuta e construção conjunta."
            />
            <Reveal delay={100} className="mt-8 space-y-5 leading-relaxed text-ivory/75">
              <p>
                Acredito que cada pessoa carrega uma história única. Por isso, o acompanhamento é
                construído de forma individualizada, respeitando o tempo, os valores e os objetivos
                de quem busca ajuda.
              </p>
              <p>
                O trabalho se apoia no sigilo profissional, no compromisso ético com a Psicologia e
                em uma relação de confiança — base indispensável para qualquer processo terapêutico.
              </p>
            </Reveal>
            <Reveal delay={180} className="mt-12 border-t border-ivory/15 pt-8">
              <p className="eyebrow text-sand">Abordagem terapêutica</p>
              <h3 className="mt-4 text-2xl text-ivory">Terapia Cognitivo-Comportamental</h3>
              <p className="mt-3 leading-relaxed text-ivory/70">
                Uma abordagem colaborativa e estruturada, que compreende a relação entre
                pensamentos, emoções e comportamentos e busca desenvolver recursos práticos para o
                dia a dia.
              </p>
            </Reveal>
          </div>
          <Reveal delay={120} className="lg:col-span-6">
            <div className="overflow-hidden rounded-xl">
              <img
                src={retratoConsultorio.url}
                alt="Pablo Ribeiro em seu consultório"
                width={1774}
                height={887}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-[80%_center] sm:aspect-[4/3]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
