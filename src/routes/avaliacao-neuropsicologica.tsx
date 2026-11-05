import { createFileRoute } from "@tanstack/react-router";

import { site, hasText } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { BookingButton } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, PendingField, SectionHeading } from "@/components/site/primitives";
import { CtaBand } from "@/components/site/sections";

export const Route = createFileRoute("/avaliacao-neuropsicologica")({
  head: () =>
    pageHead({
      title: "Avaliação Neuropsicológica em Juiz de Fora | Pablo Ribeiro, Psicólogo",
      description:
        "Avaliação Neuropsicológica com Pablo Ribeiro, psicólogo em Juiz de Fora – MG (CRP 04/53880). Entenda a finalidade, as etapas e a devolutiva.",
      path: "/avaliacao-neuropsicologica",
    }),
  component: NeuroPage,
});

const FUNCTIONS = ["Atenção", "Memória", "Linguagem", "Funções executivas", "Percepção", "Aspectos emocionais e comportamentais"];

const STEPS = [
  ["Entrevista inicial", "Conversa para compreender a demanda, a história de vida, o contexto escolar, profissional ou familiar e o motivo do encaminhamento, quando houver."],
  ["Sessões de avaliação", "Aplicação de instrumentos e tarefas selecionados de acordo com cada caso, em um ambiente tranquilo e respeitando o ritmo da pessoa avaliada."],
  ["Análise dos resultados", "Integração das informações obtidas nas sessões, nas entrevistas e em eventuais documentos e relatos complementares."],
  ["Devolutiva", "Encontro para apresentar e explicar os resultados de forma clara, com a entrega de um documento escrito e as orientações pertinentes."],
];

function NeuroPage() {
  return (
    <>
      <PageHero
        eyebrow="Especialidade"
        title={
          <>
            Avaliação <em className="font-light text-sage italic">Neuropsicológica</em>
          </>
        }
        intro="Um processo cuidadoso de investigação do funcionamento cognitivo, emocional e comportamental, que ajuda a compreender potencialidades e dificuldades de cada pessoa."
      >
        <BookingButton message="Olá, Pablo! Gostaria de informações sobre a Avaliação Neuropsicológica.">
          Solicitar informações
        </BookingButton>
      </PageHero>

      <section className="py-20 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <SectionHeading className="lg:col-span-5" eyebrow="O que é" title="Compreender como pensamos, aprendemos e nos relacionamos." />
          <Reveal delay={100} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              A avaliação neuropsicológica é um procedimento realizado por psicólogo que investiga as
              funções cognitivas e sua relação com o comportamento e as emoções. Por meio de
              entrevistas, observação e instrumentos específicos, busca-se compreender o
              funcionamento da pessoa de forma ampla.
            </p>
            <ul className="mt-10 flex flex-wrap gap-2.5">
              {FUNCTIONS.map((f) => (
                <li key={f} className="rounded-full border border-navy/15 bg-paper px-4 py-2 text-sm text-navy">
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading eyebrow="Finalidade" title="Para que serve a avaliação?" />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              ["Compreender", "Identificar potencialidades e dificuldades cognitivas, emocionais e comportamentais."],
              ["Contribuir", "Auxiliar processos diagnósticos conduzidos em conjunto com outros profissionais de saúde e educação."],
              ["Orientar", "Embasar orientações e intervenções para a pessoa avaliada, a família, a escola ou a equipe que acompanha o caso."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 100} className="rounded-xl border border-border p-8">
                <span className="font-display text-4xl font-light text-sand italic">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-2xl text-navy">{t}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <SectionHeading
            className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
            eyebrow="Etapas"
            title="Como funciona o processo avaliativo."
            intro="Cada avaliação é planejada de forma individual, considerando a demanda e as características da pessoa avaliada."
          />
          <ol className="relative space-y-12 border-l border-navy/15 pl-8 sm:pl-12 lg:col-span-8">
            {STEPS.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 80} className="relative">
                <span className="absolute top-0.5 -left-[2.6rem] flex size-8 items-center justify-center rounded-full border border-sand bg-background font-display text-sm text-navy italic sm:-left-[3.6rem]">
                  {i + 1}
                </span>
                <h3 className="text-2xl text-navy">{t}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-navy py-20 text-ivory sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              tone="inverse"
              eyebrow="Devolutiva"
              title="Resultados explicados com clareza e cuidado."
            />
            <Reveal delay={100} className="mt-8 space-y-5 leading-relaxed text-ivory/75">
              <p>
                Ao final do processo, é realizada uma sessão de devolutiva, em que os resultados são
                apresentados em linguagem acessível. É o momento de esclarecer dúvidas e discutir
                orientações e possíveis encaminhamentos.
              </p>
              <p>
                O documento resultante segue as normas do Conselho Federal de Psicologia para a
                elaboração de documentos psicológicos.
              </p>
            </Reveal>
          </div>
          <Reveal delay={150} className="space-y-4 lg:col-span-6">
            <p className="eyebrow text-sand">Informações do processo</p>
            {[
              { label: "Público atendido", value: site.neuro.audience },
              { label: "Duração e número de sessões", value: site.neuro.duration },
              { label: "Instrumentos e protocolos", value: site.neuro.instruments },
            ].map((f) =>
              hasText(f.value) ? (
                <div key={f.label} className="border-t border-ivory/15 pt-4">
                  <p className="text-sm text-ivory/55">{f.label}</p>
                  <p className="mt-1 text-ivory">{f.value}</p>
                </div>
              ) : (
                <PendingField
                  key={f.label}
                  tone="inverse"
                  label={f.label}
                  hint="Varia conforme cada caso. Entre em contato para receber orientações."
                />
              ),
            )}
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Ficou com dúvidas sobre a avaliação neuropsicológica?"
        text="Entre em contato para entender se a avaliação é indicada para você ou para quem você acompanha, e como funciona o processo."
      />
    </>
  );
}
