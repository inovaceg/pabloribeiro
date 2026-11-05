import { Link } from "@tanstack/react-router";
import { MapPin, Mail } from "lucide-react";

import { site, instagramUrl, hasText } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/contact";
import { Logo } from "./SiteHeader";
import { BookingButton } from "./booking";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { NAV_ITEMS } from "./nav";

export function SiteFooter() {
  const wa = buildWhatsAppUrl(site.contact.whatsapp);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-ivory">
      <div className="container-site grid gap-14 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo tone="inverse" />
          <p className="mt-6 max-w-sm leading-relaxed text-ivory/65">
            Psicoterapia em Terapia Cognitivo-Comportamental e Avaliação Neuropsicológica.
            Atendimento presencial em {site.city} – {site.state} e online.
          </p>
          <p className="mt-6 text-sm text-ivory/80">
            {site.name} · {site.role} · <span className="text-sand">{site.crp}</span>
          </p>
          <BookingButton variant="whatsapp" className="mt-8">
            Agendar pelo WhatsApp
          </BookingButton>
        </div>

        <nav aria-label="Rodapé" className="md:col-span-3">
          <p className="eyebrow text-sand">Navegação</p>
          <ul className="mt-5 space-y-3 text-sm">
            {[...NAV_ITEMS, { to: "/perguntas-frequentes" as const, label: "Perguntas frequentes" }].map(
              (item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-ivory/70 transition-colors hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow text-sand">Contato</p>
          <ul className="mt-5 space-y-4 text-sm text-ivory/75">
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-ivory">
                  <WhatsAppIcon className="size-4" /> {site.contact.whatsappDisplay || "WhatsApp"}
                </a>
              </li>
            )}
            <li>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-ivory">
                <InstagramIcon className="size-4" /> @{site.contact.instagramHandle}
              </a>
            </li>
            {hasText(site.contact.email) && (
              <li>
                <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-3 hover:text-ivory">
                  <Mail className="size-4" /> {site.contact.email}
                </a>
              </li>
            )}
            <li className="inline-flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                {hasText(site.office.address) ? `${site.office.address} — ` : ""}
                {site.city} – {site.state}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-site flex flex-col gap-4 py-7 pb-28 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between md:pb-7 lg:pr-72">
          <p>
            © {year} {site.name} · {site.crp}. Todos os direitos reservados.
          </p>
          <p>
            Em situação de emergência, ligue para o CVV (188) ou SAMU (192).
          </p>
          <Link to="/politica-de-privacidade" className="hover:text-ivory">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
