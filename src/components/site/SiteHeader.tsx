import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarCheck, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site, instagramUrl } from "@/config/site";
import { cn } from "@/lib/utils";
import { BookingButton, useBookingChannel } from "./booking";
import { InstagramIcon } from "./icons";
import { NAV_ITEMS } from "./nav";

/** Brand lockup: PR monogram + name + role/CRP. Designed for dark backgrounds. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3 sm:gap-4" aria-label="Pablo Ribeiro — Início">
      <span aria-hidden className="font-display text-[2.1rem] leading-none font-normal tracking-[-0.14em] text-sand sm:text-[2.4rem]">
        PR
      </span>
      <span aria-hidden className="h-9 w-px bg-sand/60 sm:h-10" />
      <span className="flex flex-col leading-none whitespace-nowrap">
        <span className="font-display text-[1.05rem] font-medium tracking-[0.06em] text-sand sm:text-[1.3rem]">
          PABLO RIBEIRO
        </span>
        {!compact && (
          <span className="mt-1.5 text-[0.58rem] font-semibold tracking-[0.16em] text-ivory/85 sm:text-[0.62rem]">
            PSICÓLOGO • {site.crp}
          </span>
        )}
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const channel = useBookingChannel();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-[76px] items-center bg-navy transition-shadow duration-500 sm:h-20",
        scrolled && "shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)]",
      )}
    >
      <div className="container-site flex items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Navegação principal" className="hidden xl:block">
          <ul className="flex items-center gap-5 2xl:gap-7">
            {NAV_ITEMS.filter((item) => item.to !== "/").map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="relative py-2 whitespace-nowrap text-[0.88rem] text-ivory/85 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-[3px] after:origin-left after:scale-x-0 after:rounded-full after:bg-sand after:transition-transform after:duration-500 hover:text-ivory hover:after:scale-x-100 data-[status=active]:font-semibold data-[status=active]:text-ivory data-[status=active]:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Agendar pelo WhatsApp"
            className="hidden items-center gap-2.5 rounded-xl border border-ivory/80 px-5 py-2.5 text-sm font-semibold tracking-[0.08em] text-ivory transition-colors duration-500 hover:bg-ivory hover:text-navy sm:inline-flex"
          >
            <CalendarCheck className="size-4" strokeWidth={1.6} />
            AGENDAR
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-11 items-center justify-center rounded-xl border border-ivory/25 text-ivory transition-colors hover:bg-ivory/10 xl:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full flex-col border-l-0 bg-navy p-0 text-ivory sm:max-w-md [&>button]:top-7 [&>button]:right-6 [&>button]:rounded-full [&>button]:p-2 [&>button]:text-ivory [&>button]:opacity-80 [&>button]:data-[state=open]:bg-transparent"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="px-8 pt-6">
                <Logo />
              </div>
              <nav aria-label="Menu móvel" className="mt-10 flex-1 overflow-y-auto px-8">
                <ul>
                  {NAV_ITEMS.map(
                    (item, i) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          activeOptions={{ exact: item.to === "/" }}
                          className="flex items-baseline gap-4 border-b border-ivory/10 py-4 font-display text-2xl text-ivory/75 transition-colors hover:text-ivory data-[status=active]:text-ivory"
                        >
                          <span className="font-sans text-xs text-sand">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {item.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
              <div className="space-y-4 px-8 pt-6 pb-10">
                <BookingButton variant="whatsapp" className="w-full py-4">
                  Agendar pelo WhatsApp
                </BookingButton>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 text-sm text-ivory/70 hover:text-ivory"
                >
                  <InstagramIcon className="size-4" /> @{site.contact.instagramHandle}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
