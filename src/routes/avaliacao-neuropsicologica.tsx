import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { BOOKING_MESSAGES } from "@/lib/contact";
import { pageHead } from "@/lib/seo";
import { BookingButton } from "@/components/site/booking";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, SectionHeading } from "@/components/site/primitives";
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

const FUNCTIONS = [
  ["Atenção", "Capacidade de selecionar, manter e alternar o foco."],
  ["Memória", "Como as informações são registradas, armazenadas e recuperadas."],
  ["Linguagem", "Compreensão e expressão, oral e escrita."],
  ["Funções executivas", "Planejamento, organização, flexibilidade e controle de impulsos."],
  ["Aspectos emocionais e comportamentais", "Como emoções e comportamentos se relacionam com o funcionamento cognitivo."],
] as const;

const INDICATIONS = [
  "Dificuldades de atenção, concentração ou organização",
  "Queixas de memória, em qualquer fase da vida",
  "Dificuldades de aprendizagem ou de desempenho escolar",
  "Investigação de hipóteses como TDAH ou TEA",
  "Mudanças cognitivas percebidas pela pessoa ou pela família",
  "Orientação de intervenções, adaptações escolares ou tratamento",
];

const STEPS = [
  ["Entrevista inicial", "Conversa para compreender a demanda, a história de vida, o contexto escolar, profissional ou familiar e o motivo do encaminhamento, quando houver."],
  ["Sessões de avaliação", "Aplicação de instrumentos e tarefas selecionados de acordo com cada caso, em um ambiente tranquilo e respeitando o ritmo da pessoa avaliada."],
  ["Análise dos resultados", "Integração das informações obtidas nas sessões, nas entrevistas e em eventuais documentos e relatos complementares."],
  ["Devolutiva", "Encontro para apresentar e explicar os resultados de forma clara, esclarecer dúvidas e discutir as orientações pertinentes."],
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
        <BookingButton variant="whatsapp" message={BOOKING_MESSAGES.avaliacao}>
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
            <p className="mt-8 eyebrow text-sage">Funções que podem ser investigadas</p>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {FUNCTIONS.map(([f, d]) => (
                <div key={f} className="border-t border-navy/15 pt-4">
                  <dt className="font-display text-lg text-navy">{f}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-relaxed text-muted-foreground">{d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy py-20 text-ivory sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="inverse"
              eyebrow="Para quem é indicada"
              title="Crianças, adolescentes, adultos e idosos."
              intro="A avaliação pode ser realizada em diferentes fases da vida. Muitas vezes ela é solicitada por médicos, escolas ou outros profissionais — mas a própria pessoa ou a família também pode buscá-la."
            />
            <Reveal delay={120} className="mt-8">
              <BookingButton variant="light" message={BOOKING_MESSAGES.avaliacao}>
                Saber se é indicada para mim
              </BookingButton>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow text-sand">Situações em que costuma ser indicada</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {INDICATIONS.map((t, i) => (
                <Reveal as="li" key={t} delay={i * 60} className="flex gap-3 rounded-xl border border-ivory/15 bg-ivory/5 p-5 leading-relaxed text-ivory/85">
                  <Check className="mt-1 size-4 shrink-0 text-sand" aria-hidden />
                  {t}
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ivory/60">
              A indicação é sempre avaliada individualmente. Em casos de investigação diagnóstica, a
              avaliação contribui para o trabalho conduzido em conjunto com outros profissionais.
            </p>
          </div>
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
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading
              tone="inverse"
              eyebrow="Devolutiva"
              title="Resultados explicados com clareza e cuidado."
            />
            <Reveal delay={100} className="mt-8 space-y-5 leading-relaxed text-ivory/75">
              <p>
                Ao final do processo, é realizada uma sessão de devolutiva, em que os resultados são
                apresentados em linguagem acessível. É o momento de esclarecer dúvidas e conversar
                sobre orientações e possíveis encaminhamentos.
              </p>
              <p>
                Como cada avaliação é planejada de forma individual, informações sobre o número de
                sessões e prazos são passadas no primeiro contato.
              </p>
            </Reveal>
          </div>
          <Reveal delay={150} className="lg:col-span-5 lg:justify-self-end">
            <BookingButton message={BOOKING_MESSAGES.avaliacao} variant="light">
              Solicitar informações
            </BookingButton>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Ficou com dúvidas sobre a avaliação neuropsicológica?"
        text="Entre em contato para entender se a avaliação é indicada para você ou para quem você acompanha, e como funciona o processo."
        message={BOOKING_MESSAGES.avaliacao}
      />
    </>
  );
}
