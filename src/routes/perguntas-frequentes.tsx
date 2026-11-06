import { createFileRoute } from "@tanstack/react-router";

import { FAQ } from "@/content/faq";
import { pageHead } from "@/lib/seo";
import { BookingButton } from "@/components/site/booking";
import { FaqList } from "@/components/site/FaqList";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/primitives";
import { JsonLd } from "@/components/site/JsonLd";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/perguntas-frequentes")({
  head: () => ({
    ...pageHead({
      title: "Perguntas frequentes | Pablo Ribeiro, Psicólogo em Juiz de Fora",
      description:
        "Dúvidas sobre a primeira consulta, agendamento, atendimento online, Terapia Cognitivo-Comportamental e Avaliação Neuropsicológica.",
      path: "/perguntas-frequentes",
    }),
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <PageHero
        eyebrow="Perguntas frequentes"
        title={
          <>
            Dúvidas comuns, <em className="font-light text-sage italic">respostas claras.</em>
          </>
        }
        intro="Reuni aqui as perguntas mais frequentes sobre o atendimento. Se a sua dúvida não estiver na lista, fique à vontade para entrar em contato."
      />
      <section className="py-16 sm:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <FaqList items={FAQ} />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4">
            <div className="rounded-xl bg-navy p-8 text-ivory lg:sticky lg:top-32">
              <p className="eyebrow text-sand">Ainda com dúvidas?</p>
              <p className="mt-4 font-display text-2xl leading-snug">
                Converse diretamente comigo para receber orientações.
              </p>
              <BookingButton variant="whatsapp" className="mt-8 w-full">
                Falar no WhatsApp
              </BookingButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
