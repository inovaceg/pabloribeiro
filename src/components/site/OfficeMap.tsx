import { site, hasText } from "@/config/site";

/** Embedded office map. Renders nothing until a confirmed map URL is configured. */
export function OfficeMap({ className = "" }: { className?: string }) {
  if (!hasText(site.office.mapEmbedUrl)) return null;
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
