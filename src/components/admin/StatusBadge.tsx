import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: "draft" | "published"; className?: string }) {
  const published = status === "published";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        published ? "bg-sage-soft text-navy" : "bg-sand-soft text-navy",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", published ? "bg-sage" : "bg-sand")} />
      {published ? "Publicado" : "Rascunho"}
    </span>
  );
}
