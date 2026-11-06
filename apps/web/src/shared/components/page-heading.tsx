import type { ReactNode } from "react";

export function PageHeading({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4 sm:mb-6">
      <div className="flex flex-col gap-2">
        {eyebrow ? (
          <p className="font-semibold text-[11px] text-primary uppercase tracking-[0.16em]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
        {description ? (
          <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
