import { MapPin } from "lucide-react";

import { site, hasText } from "@/config/site";

/** Shows the embedded map once an address/embed URL is configured; otherwise a discreet placeholder. */
export function OfficeMap({ className = "" }: { className?: string }) {
  if (hasText(site.office.mapEmbedUrl)) {
    return (
      <div className={`overflow-hidden rounded-xl border border-border bg-muted ${className}`}>
        <iframe
          title={`Mapa do consultório — ${site.city}`}
          src={site.office.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full min-h-80 w-full grayscale-[35%]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex min-h-80 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-sand/70 bg-sand-soft/40 p-8 text-center ${className}`}
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full text-sand/25" preserveAspectRatio="none">
        <defs>
          <pattern id="map-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0H0V36" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
      </svg>
      <span className="relative inline-flex size-12 items-center justify-center rounded-full bg-navy text-ivory">
        <MapPin className="size-5" />
      </span>
      <p className="relative mt-4 font-display text-xl text-navy">
        {site.city} – {site.state}
      </p>
      <p className="relative mt-2 max-w-xs text-sm text-muted-foreground">
        O mapa do consultório será exibido aqui após a confirmação do endereço.
      </p>
    </div>
  );
}
