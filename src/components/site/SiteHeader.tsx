import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site, instagramUrl } from "@/config/site";
import { cn } from "@/lib/utils";
import { BookingButton } from "./booking";
import { InstagramIcon } from "./icons";
import { NAV_ITEMS } from "./nav";

export function Logo({ tone = "default" }: { tone?: "default" | "inverse" }) {
  return (
    <Link to="/" className="group inline-flex flex-col leading-none" aria-label="Pablo Ribeiro — Início">
      <span
        className={cn(
          "text-[0.95rem] font-semibold tracking-[0.32em]",
          tone === "inverse" ? "text-ivory" : "text-navy",
        )}
      >
        PABLO RIBEIRO
      </span>
      <span className="mt-1.5 font-display text-[0.95rem] text-sand italic">{site.role}</span>
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-elegant",
        scrolled
          ? "border-b border-border/70 bg-ivory/85 py-3 backdrop-blur-md"
          : "border-b border-transparent py-5 sm:py-7",
      )}
    >
      <div className="container-site flex items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Navegação principal" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="relative py-2 text-[0.84rem] text-navy/75 transition-colors hover:text-navy data-[status=active]:text-navy after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-sand after:transition-transform after:duration-500 hover:after:scale-x-100 data-[status=active]:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <BookingButton className="hidden px-5 py-3 text-xs tracking-[0.14em] uppercase sm:inline-flex" showIcon={false}>
            Agendar consulta
          </BookingButton>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-11 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors hover:bg-navy/5 xl:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full flex-col border-l-0 bg-navy p-0 text-ivory sm:max-w-md [&>button]:top-7 [&>button]:right-6 [&>button]:text-ivory"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="px-8 pt-7">
                <Logo tone="inverse" />
              </div>
              <nav aria-label="Menu móvel" className="mt-12 flex-1 overflow-y-auto px-8">
                <ul className="space-y-1">
                  {[...NAV_ITEMS, { to: "/perguntas-frequentes" as const, label: "Perguntas frequentes" }].map(
                    (item, i) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          activeOptions={{ exact: item.to === "/" }}
                          className="flex items-baseline gap-4 border-b border-ivory/10 py-4 font-display text-2xl text-ivory/80 transition-colors hover:text-ivory data-[status=active]:text-ivory"
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
                <BookingButton variant="light" className="w-full">
                  Agendar consulta
                </BookingButton>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-ivory/70 hover:text-ivory"
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
