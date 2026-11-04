import type { ReactNode } from "react";

export function SocialHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b px-4 py-5 sm:px-5">
      <div className="min-w-0">
        <h1 className="font-bold text-xl tracking-tight sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {children}
    </header>
  );
}
