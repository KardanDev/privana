import type { LucideIcon } from "lucide-react";
export function StatCard({
  label,
  value,
  icon: Icon,
  detail,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  detail?: string;
}) {
  return (
    <div className="min-w-0 border-border/70 border-b px-1 py-3 sm:px-4 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-muted-foreground text-xs sm:text-sm">
          {label}
        </p>
        <Icon
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground/70"
        />
      </div>
      <p className="mt-1 font-heading font-semibold text-2xl tabular-nums tracking-tight sm:mt-2 sm:text-3xl">
        {value.toLocaleString("pt-BR")}
      </p>
      {detail ? (
        <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
          {detail}
        </p>
      ) : null}
    </div>
  );
}
