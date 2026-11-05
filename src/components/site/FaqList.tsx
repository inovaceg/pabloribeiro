import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/content/faq";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="border-t border-navy/15">
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`item-${i}`} className="border-navy/15">
          <AccordionTrigger className="gap-6 py-6 font-display text-lg font-normal text-navy hover:no-underline sm:text-xl [&>svg]:size-5 [&>svg]:text-sand">
            <span className="flex items-baseline gap-4">
              <span className="font-sans text-xs text-sand">{String(i + 1).padStart(2, "0")}</span>
              {item.q}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-7 pl-8 text-base leading-relaxed text-muted-foreground sm:pr-12">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
