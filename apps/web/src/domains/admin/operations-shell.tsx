"use client";

import { Button } from "@privana/ui/components/button";
import { cn } from "@privana/ui/lib/utils";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { Brand } from "@/shared/components/brand";
import { usePlatform } from "@/shared/platform/use-platform";
import {
  type OperationsSection,
  operationsNavigation,
  teamRoleLabels,
} from "./operations-navigation";

export function OperationsShell({
  section,
  onSelect,
  viewerName,
  viewerRole,
  children,
}: {
  section: OperationsSection;
  onSelect: MouseEventHandler<HTMLButtonElement>;
  viewerName: string;
  viewerRole: string;
  children: ReactNode;
}) {
  const current = operationsNavigation.find((item) => item.id === section);
  const config = usePlatform();
  return (
    <div className="min-h-svh bg-background">
      <a
        className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-primary p-3 text-primary-foreground focus:not-sr-only"
        href="#operations-main"
      >
        Pular para a operação
      </a>
      <aside className="border-b bg-card lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <Brand />
          <span className="rounded border bg-muted px-2 py-1 font-semibold text-[10px] uppercase tracking-wider">
            Gestão
          </span>
        </div>
        <nav
          aria-label="Seções da operação"
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {operationsNavigation
            .filter((item) => item.roles.some((role) => role === viewerRole))
            .map(({ id, label, icon: Icon }) => (
              <button
                aria-current={section === id ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  section === id
                    ? "bg-accent font-semibold text-primary"
                    : "text-muted-foreground"
                )}
                key={id}
                onClick={onSelect}
                type="button"
                value={id}
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </button>
            ))}
        </nav>
        <div className="mt-auto hidden border-t p-5 lg:block">
          <p className="truncate font-medium text-sm">{viewerName}</p>
          <p className="mt-1 text-muted-foreground text-xs">
            {teamRoleLabels[viewerRole] ?? viewerRole}
          </p>
          <p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            Área restrita à equipe
          </p>
        </div>
      </aside>
      <div className="lg:pl-60">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b bg-card px-5 py-3 sm:px-8">
          <div>
            <p className="font-semibold text-sm">Operação da plataforma</p>
            <p className="mt-0.5 text-muted-foreground text-xs lg:hidden">
              {teamRoleLabels[viewerRole] ?? viewerRole}
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            size="sm"
            variant="outline"
          >
            Ver plataforma
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </header>
        <main
          className="mx-auto flex max-w-[1440px] flex-col gap-6 p-5 sm:p-8"
          id="operations-main"
        >
          <div>
            <p className="mb-1 font-medium text-[10px] text-primary uppercase tracking-[0.14em]">
              {config.brand.name} / Operação
            </p>
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
