import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";

import { instagramDirectUrl, site } from "@/config/site";
import { getBookingChannel } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";

export function useBookingChannel(message?: string) {
  return getBookingChannel(site.contact.whatsapp, instagramDirectUrl, message);
}

type Variant = "primary" | "light" | "outline" | "whatsapp";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-navy-deep",
  light: "bg-ivory text-navy hover:bg-paper",
  outline: "border border-navy/25 text-navy hover:border-navy hover:bg-navy/5",
  whatsapp: "bg-whatsapp text-whatsapp-foreground hover:brightness-95",
};

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-medium tracking-wide transition-all duration-500 ease-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    VARIANTS[variant],
    className,
  );
}

/** Primary scheduling button. Uses WhatsApp when configured, Instagram Direct otherwise. */
export function BookingButton({
  children = "Agendar atendimento",
  message,
  variant = "primary",
  className,
  showIcon = true,
}: {
  children?: ReactNode;
  message?: string;
  variant?: Variant;
  className?: string;
  showIcon?: boolean;
}) {
  const channel = useBookingChannel(message);
  const Icon = channel.kind === "whatsapp" ? WhatsAppIcon : MessageCircle;
  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass(variant, className)}
      aria-label={`${typeof children === "string" ? children : "Agendar"} — abre o ${
        channel.kind === "whatsapp" ? "WhatsApp" : "Direct do Instagram"
      } em nova aba`}
    >
      {showIcon && <Icon className="size-4" />}
      <span>{children}</span>
    </a>
  );
}

/** Floating contact button visible on every page. */
export function FloatingBooking() {
  const channel = useBookingChannel();
  const isWa = channel.kind === "whatsapp";
  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={isWa ? "Agendar pelo WhatsApp" : "Agendar pelo Direct do Instagram"}
      className={cn(
        "fixed right-4 bottom-4 z-40 inline-flex items-center gap-2.5 rounded-full py-3.5 pr-5 pl-4 text-sm font-medium shadow-soft transition-all duration-500 ease-elegant hover:-translate-y-0.5 sm:right-6 sm:bottom-6",
        isWa
          ? "bg-whatsapp text-whatsapp-foreground ring-1 ring-paper/40"
          : "bg-primary text-primary-foreground ring-1 ring-sand/50",
      )}
    >
      {isWa ? <WhatsAppIcon className="size-5" /> : <MessageCircle className="size-5" />}
      <span>Agendar</span>
    </a>
  );
}
