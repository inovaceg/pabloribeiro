import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MonitorSmartphone, ShieldCheck } from "lucide-react";

import { site, instagramUrl, hasText } from "@/config/site";
import { BOOKING_MESSAGES } from "@/lib/contact";
import { pageHead } from "@/lib/seo";
import { BookingButton } from "@/components/site/booking";
import { ContactForm } from "@/components/site/ContactForm";
import { InstagramIcon, WhatsAppIcon } from "@/components/site/icons";
import { OfficeMap } from "@/components/site/OfficeMap";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/primitives";

export const Route = createFileRoute("/contato")({
  head: () =>
    pageHead({
      title: "Contato e agendamento pelo WhatsApp | Pablo Ribeiro, Psicólogo em Juiz de Fora",
      description:
        "Agende seu atendimento com Pablo Ribeiro, psicólogo em Juiz de Fora – MG, pelo WhatsApp (32) 98841-1284, Instagram ou formulário. Presencial e online.",
      path: "/contato",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title={
          <>
            Vamos <em className="font-light italic">conversar?</em>
          </>
        }
        intro="Fale comigo pelo WhatsApp para tirar dúvidas ou agendar um horário. O retorno é feito pessoalmente, o mais breve possível."
      >
        <BookingButton variant="whatsapp" message={BOOKING_MESSAGES.agendamento} className="py-4 sm:px-8">
          Conversar no WhatsApp
        </BookingButton>
      </PageHero>

      <section className="py-16 sm:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 lg:col-span-5">
            <Reveal className="relative isolate overflow-hidden rounded-2xl bg-whatsapp p-8 text-whatsapp-foreground sm:p-10">
              <WhatsAppIcon aria-hidden className="absolute -right-8 -bottom-8 -z-10 size-48 opacity-15" />
              <p className="eyebrow opacity-85">WhatsApp</p>
              <p className="mt-4 font-display text-3xl sm:text-4xl">{site.contact.whatsappDisplay}</p>
              <p className="mt-3 leading-relaxed opacity-90">
                A forma mais rápida de agendar. Clique e envie sua mensagem.
              </p>
              <BookingButton variant="light" message={BOOKING_MESSAGES.agendamento} className="mt-8 w-full sm:w-auto">
                Abrir conversa
              </BookingButton>
            </Reveal>

            <Reveal delay={80} className="divide-y divide-navy/10 rounded-2xl border border-border bg-paper">
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
                    {site.city} – {site.state}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6">
                <MonitorSmartphone className="size-5 text-sage" />
                <div>
                  <p className="text-sm text-muted-foreground">Modalidades</p>
                  <p className="text-navy">Presencial e online</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-paper p-6 sm:p-10">
              <h2 className="text-3xl text-navy">Formulário de contato</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Preencha os campos abaixo: sua mensagem será organizada e aberta no WhatsApp para
                você revisar e enviar.
              </p>
              <p className="mt-5 mb-8 flex gap-3 rounded-lg bg-sage-soft/70 p-4 text-sm leading-relaxed text-navy">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden />
                Por segurança, não compartilhe informações clínicas ou de saúde por aqui. Esses
                assuntos são tratados durante o atendimento, sob sigilo profissional.
              </p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      {hasText(site.office.mapEmbedUrl) && (
        <section className="pb-20 sm:pb-28">
          <div className="container-site">
            <OfficeMap className="h-[26rem]" />
          </div>
        </section>
      )}
    </>
  );
}
