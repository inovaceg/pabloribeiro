import { Link } from "@tanstack/react-router";
import { MapPin, Mail } from "lucide-react";

import { site, instagramUrl, hasText } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/contact";
import { Logo } from "./SiteHeader";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { NAV_ITEMS } from "./nav";

export function SiteFooter() {
  const wa = buildWhatsAppUrl(site.contact.whatsapp);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-ivory">
      <div className="container-site flex flex-col gap-10 py-14 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          <Logo />
          <span aria-hidden className="hidden h-12 w-px bg-ivory/20 sm:block" />
          <div className="flex items-center gap-3">
            <MapPin className="size-6 shrink-0 text-sand" strokeWidth={1.4} />
            <div className="leading-snug">
              <p className="text-sm font-semibold">
                {hasText(site.office.address) ? `${site.office.address} — ` : ""}
                {site.city} – {site.state}
              </p>
              <p className="text-sm text-ivory/65">Atendimento presencial e online</p>
            </div>
          </div>
        </div>

        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-ivory/85 transition-colors hover:text-sand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-site flex flex-col gap-5 py-7 pb-28 text-xs text-ivory/60 md:pb-7 lg:flex-row lg:items-center lg:justify-between lg:pr-72">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ivory/80">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ivory">
                <WhatsAppIcon className="size-4 text-sand" /> {site.contact.whatsappDisplay || "WhatsApp"}
              </a>
            )}
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ivory">
              <InstagramIcon className="size-4 text-sand" /> @{site.contact.instagramHandle}
            </a>
            {hasText(site.contact.email) && (
              <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2 hover:text-ivory">
                <Mail className="size-4 text-sand" /> {site.contact.email}
              </a>
            )}
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <p>
              © {year} {site.name} · {site.role} · {site.crp} ·{" "}
              <Link to="/politica-de-privacidade" className="underline-offset-4 hover:text-ivory hover:underline">
                Política de Privacidade
              </Link>
            </p>
            <p>Em situação de emergência, ligue para o CVV (188) ou SAMU (192).</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
