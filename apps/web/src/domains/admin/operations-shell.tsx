"use client";

import { buttonVariants } from "@privana/ui/components/button";
import { cn } from "@privana/ui/lib/utils";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/shared/appearance/theme-toggle";
import { Brand } from "@/shared/components/brand";
import {
  type OperationsSection,
  operationsNavigation,
  teamRoleLabels,
} from "./operations-navigation";
import { OperationsSectionNavigation } from "./operations-section-navigation";

export function OperationsShell({
  section,
  onSelect,
  viewerName,
  viewerRole,
  children,
}: {
  section: OperationsSection;
  onSelect: (section: string) => void;
  viewerName: string;
  viewerRole: string;
  children: ReactNode;
}) {
  const current = operationsNavigation.find(
    (item) =>
      item.id === section && item.roles.some((role) => role === viewerRole)
  );
  return (
    <div className="min-h-svh bg-background">
      <a
        className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-primary p-3 text-primary-foreground focus:not-sr-only"
        href="#operations-main"
      >
        Pular para a operação
      </a>
      <aside className="hidden border-r bg-card pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-60 lg:flex-col lg:overflow-y-auto">
        <div className="flex shrink-0 flex-col items-start gap-3 px-5 py-5">
          <Brand wrapName />
        </div>
        <OperationsSectionNavigation
          onSelect={onSelect}
          section={section}
          viewerRole={viewerRole}
        />
        <div className="mt-auto shrink-0 border-t p-5 [overflow-wrap:anywhere]">
          <p className="font-medium text-sm">{viewerName}</p>
          <p className="mt-1 text-muted-foreground text-sm">
            {teamRoleLabels[viewerRole] ?? viewerRole}
          </p>
          <p className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            Área restrita à equipe
          </p>
        </div>
      </aside>
      <div className="lg:pl-60">
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b bg-card px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 sm:px-8">
          <div className="min-w-0 flex-1 basis-40 [overflow-wrap:anywhere]">
            <div className="lg:hidden">
              <Brand wrapName />
            </div>
            <p className="hidden font-semibold text-sm lg:block">
              Operação da plataforma
            </p>
            <p className="mt-1 text-muted-foreground text-sm">
              Gestão · {teamRoleLabels[viewerRole] ?? viewerRole}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link
              className={cn(buttonVariants({ variant: "outline" }))}
              href="/"
            >
              Voltar à comunidade
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </div>
          <div className="w-full min-w-0 lg:hidden">
            <OperationsSectionNavigation
              compact
              onSelect={onSelect}
              section={section}
              viewerRole={viewerRole}
            />
          </div>
        </header>
        <main
          className="mx-auto flex min-w-0 max-w-[1440px] scroll-mt-4 flex-col gap-6 px-4 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] outline-none sm:px-8"
          id="operations-main"
          tabIndex={-1}
        >
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">
              {current?.label}
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              {current?.description}
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
