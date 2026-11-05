import { createFileRoute } from "@tanstack/react-router";
import { Clock, Lock, MapPin, Wifi, Headphones, CalendarCheck, Info } from "lucide-react";

import { site, hasText } from "@/config/site";
import { BOOKING_MESSAGES } from "@/lib/contact";
import { pageHead } from "@/lib/seo";
import { BookingButton } from "@/components/site/booking";
import { OfficeMap } from "@/components/site/OfficeMap";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, PageHero } from "@/components/site/primitives";
import { CtaBand } from "@/components/site/sections";

export const Route = createFileRoute("/atendimento")({
  head: () =>
    pageHead({
      title: "Atendimento presencial em Juiz de Fora e online | Pablo Ribeiro, Psicólogo",
      description:
        "Psicoterapia presencial em Juiz de Fora – MG e atendimento psicológico online por videochamada. Saiba como funcionam as sessões e como agendar.",
      path: "/atendimento",
    }),
  component: CarePage,
});

function InfoRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex gap-4 border-t border-navy/10 pt-4">
      <Icon className="mt-0.5 size-5 shrink-0 text-sage" strokeWidth={1.5} aria-hidden />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-navy">{value}</p>
      </div>
    </div>
  );
}

function CarePage() {
  const fullAddress = [site.office.address, site.office.neighborhood, site.office.cep].filter(hasText).join(" · ");
  const hasMap = hasText(site.office.mapEmbedUrl);
  return (
    <>
      <PageHero
        eyebrow="Atendimento"
        title={
          <>
            Presencial em Juiz de Fora <em className="font-light text-sage italic">e online.</em>
          </>
        }
        intro="Duas modalidades, o mesmo compromisso com a ética, o sigilo e a qualidade da escuta. Você escolhe a que melhor se adapta à sua rotina."
      >
        <BookingButton message={BOOKING_MESSAGES.agendamento}>Agendar atendimento</BookingButton>
      </PageHero>

      <section id="presencial" className="py-20 sm:py-28">
        <div className={`container-site grid gap-12 lg:gap-16 ${hasMap ? "lg:grid-cols-12" : "lg:grid-cols-2"}`}>
          <Reveal className={hasMap ? "lg:col-span-5" : ""}>
            <Eyebrow>Atendimento presencial</Eyebrow>
            <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl">
              Consultório em {site.city} – {site.state}
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Sessões em um ambiente reservado, pensado para que cada encontro aconteça com
              tranquilidade e privacidade.
            </p>
            {(hasText(fullAddress) || hasText(site.office.hours) || hasText(site.office.details)) && (
              <div className="mt-8 space-y-4">
                {hasText(fullAddress) && <InfoRow icon={MapPin} label="Endereço" value={fullAddress} />}
                {hasText(site.office.hours) && <InfoRow icon={Clock} label="Dias e horários" value={site.office.hours} />}
                {hasText(site.office.details) && <InfoRow icon={Info} label="Informações" value={site.office.details} />}
              </div>
            )}
          </Reveal>
          {hasMap ? (
            <Reveal delay={120} className="lg:col-span-7">
              <OfficeMap className="h-full min-h-96" />
            </Reveal>
          ) : (
            <Reveal delay={120} className="rounded-xl border border-border bg-paper p-8 sm:p-10 lg:self-end">
              <MapPin className="size-6 text-sage" strokeWidth={1.4} aria-hidden />
              <p className="mt-5 font-display text-2xl text-navy">Localização e horários</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                O endereço do consultório e a disponibilidade de horários são informados no momento
                do agendamento, pelo WhatsApp.
              </p>
              <BookingButton message={BOOKING_MESSAGES.agendamento} variant="outline" className="mt-7">
                Consultar disponibilidade
              </BookingButton>
            </Reveal>
          )}
        </div>
      </section>

      <section id="online" className="bg-paper py-20 sm:py-28">
        <div className="container-site">
          <Reveal className="max-w-2xl">
            <Eyebrow>Atendimento online</Eyebrow>
            <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl">
              Sessões por videochamada, onde você estiver.
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              O atendimento online segue as mesmas diretrizes éticas do presencial, conforme as
              orientações do Conselho Federal de Psicologia.
              {hasText(site.sessions.onlinePlatform) && ` As sessões acontecem pelo ${site.sessions.onlinePlatform}.`}
            </p>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Lock, t: "Privacidade", d: "As sessões online têm o mesmo sigilo profissional do atendimento presencial." },
              { icon: Headphones, t: "Ambiente adequado", d: "Escolha um local reservado e silencioso. Fones de ouvido ajudam a preservar sua privacidade." },
              { icon: Wifi, t: "Condições técnicas", d: "Uma internet estável e um celular ou computador com câmera e microfone são suficientes." },
              { icon: CalendarCheck, t: "Agendamento", d: "Os horários são combinados previamente pelo WhatsApp, assim como as orientações para a sessão." },
            ].map((it, i) => (
              <Reveal key={it.t} delay={i * 90} className="border-t border-navy/15 pt-6">
                <it.icon className="size-6 text-sage" strokeWidth={1.4} aria-hidden />
                <h3 className="mt-5 text-xl text-navy">{it.t}</h3>
                <p className="mt-2.5 leading-relaxed text-muted-foreground">{it.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Vamos encontrar o melhor formato para você?"
        text="Entre em contato pelo WhatsApp para verificar a disponibilidade de horários, escolher a modalidade e tirar suas dúvidas."
      />
    </>
  );
}
