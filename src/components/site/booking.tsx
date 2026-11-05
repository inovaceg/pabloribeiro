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

/** Floating WhatsApp button, always in view on every page. */
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
        "group fixed right-4 bottom-4 z-[45] inline-flex items-center gap-3 rounded-full p-2 text-sm sm:pr-5 font-medium shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-paper/30 transition-all duration-500 ease-elegant hover:-translate-y-1 sm:right-6 sm:bottom-6",
        isWa ? "bg-whatsapp text-whatsapp-foreground" : "bg-primary text-primary-foreground",
      )}
    >
      <span className="relative flex size-11 items-center justify-center rounded-full bg-paper/15 sm:size-10">
        <span aria-hidden className="absolute inset-0 rounded-full bg-paper/40 animate-soft-pulse" />
        {isWa ? <WhatsAppIcon className="relative size-6 sm:size-5" /> : <MessageCircle className="relative size-6 sm:size-5" />}
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-[0.65rem] font-normal tracking-[0.14em] uppercase opacity-80">
          {isWa ? "WhatsApp" : "Instagram"}
        </span>
        <span>Agende sua consulta</span>
      </span>
    </a>
  );
}
