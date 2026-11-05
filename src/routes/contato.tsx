import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle } from "lucide-react";

import { site, instagramUrl, hasText } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { BookingButton, useBookingChannel } from "@/components/site/booking";
import { ContactForm } from "@/components/site/ContactForm";
import { InstagramIcon, WhatsAppIcon } from "@/components/site/icons";
import { OfficeMap } from "@/components/site/OfficeMap";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/primitives";

export const Route = createFileRoute("/contato")({
  head: () =>
    pageHead({
      title: "Contato e agendamento | Pablo Ribeiro, Psicólogo em Juiz de Fora",
      description:
        "Agende seu atendimento com Pablo Ribeiro, psicólogo em Juiz de Fora – MG. Contato por WhatsApp, Instagram ou formulário. Atendimento presencial e online.",
      path: "/contato",
    }),
  component: ContactPage,
});

function ContactPage() {
  const channel = useBookingChannel();
  const isWa = channel.kind === "whatsapp";

  return (
    <>
      <PageHero
        eyebrow="Contato"
        title={
          <>
            Vamos <em className="font-light text-sage italic">conversar?</em>
          </>
        }
        intro="Envie sua mensagem para tirar dúvidas ou agendar um horário. O retorno é feito pessoalmente, o mais breve possível."
      />

      <section className="py-16 sm:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 lg:col-span-5">
            <Reveal className="rounded-xl bg-navy p-8 text-ivory sm:p-10">
              {isWa ? <WhatsAppIcon className="size-7 text-sand" /> : <MessageCircle className="size-7 text-sand" />}
              <h2 className="mt-5 text-2xl text-ivory sm:text-3xl">
                {isWa ? "Agende pelo WhatsApp" : "Agende pelo Instagram"}
              </h2>
              <p className="mt-3 leading-relaxed text-ivory/70">
                {isWa
                  ? "A forma mais rápida de falar comigo. Clique e envie sua mensagem."
                  : "Envie uma mensagem pelo Direct do Instagram para tirar dúvidas e agendar."}
              </p>
              <BookingButton variant={isWa ? "whatsapp" : "light"} className="mt-8 w-full sm:w-auto">
                {isWa ? "Conversar no WhatsApp" : "Enviar mensagem"}
              </BookingButton>
              {isWa && hasText(site.contact.whatsappDisplay) && (
                <p className="mt-4 text-sm text-ivory/60">{site.contact.whatsappDisplay}</p>
              )}
            </Reveal>

            <Reveal delay={80} className="divide-y divide-navy/10 rounded-xl border border-border bg-paper">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 transition-colors hover:bg-sand-soft/40">
                <InstagramIcon className="size-5 text-sage" />
                <div>
                  <p className="text-sm text-muted-foreground">Instagram</p>
                  <p className="text-navy">@{site.contact.instagramHandle}</p>
                </div>
              </a>
              {hasText(site.contact.email) && (
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-4 p-6 transition-colors hover:bg-sand-soft/40">
                  <Mail className="size-5 text-sage" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="text-navy">{site.contact.email}</p>
                  </div>
                </a>
              )}
              <div className="flex items-center gap-4 p-6">
                <MapPin className="size-5 text-sage" />
                <div>
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="text-navy">
                    {hasText(site.office.address) ? `${site.office.address} — ` : ""}
                    {site.city} – {site.state} · e online
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-7">
            <h2 className="text-3xl text-navy">Formulário de contato</h2>
            <p className="mt-3 mb-10 leading-relaxed text-muted-foreground">
              Preencha os campos abaixo. Sua mensagem será preparada para envio direto a mim.
            </p>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-site">
          <OfficeMap className="h-[26rem]" />
        </div>
      </section>
    </>
  );
}
