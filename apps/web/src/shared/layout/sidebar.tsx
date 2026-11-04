"use client";
import type { ViewerDTO } from "@privana/api/contracts/product";
import { Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/shared/components/brand";
import { usePlatform } from "@/shared/platform/use-platform";
import { NavLink } from "./nav-link";
import { accountNavigation, navigation } from "./navigation";
import { SidebarAccount } from "./sidebar-account";

export function Sidebar({ viewer }: { viewer: ViewerDTO | null | undefined }) {
  const config = usePlatform();
  const isStaff =
    viewer && ["admin", "editor", "moderator", "analyst"].includes(viewer.role);
  return (
    <aside className="fixed inset-y-0 z-30 hidden w-[88px] flex-col overflow-y-auto bg-background px-3 py-5 lg:flex xl:w-[216px] xl:px-4">
      <div className="mb-8 flex justify-center px-1 xl:justify-start">
        <Brand />
      </div>
      <nav aria-label="Navegação principal" className="flex flex-col gap-1">
        {navigation
          .filter(
            (item) => item.key !== "messages" || config.features.messaging
          )
          .map((item) => (
            <NavLink
              href={item.href}
              icon={item.icon}
              key={item.href}
              label={config.navigation[item.key]}
            />
          ))}
      </nav>
      <div className="my-4 border-t" />
      <nav aria-label="Sua conta" className="flex flex-col gap-1">
        {accountNavigation.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            label={
              item.href === "/studio" ? config.navigation.studio : item.label
            }
          />
        ))}
        {isStaff ? (
          <NavLink href="/admin" icon={ShieldCheck} label="Administração" />
        ) : null}
      </nav>
      {config.features.creatorApplications || viewer?.creatorId ? (
        <Link
          aria-label={
            viewer?.creatorId ? "Nova publicação" : "Criar meu perfil"
          }
          className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90"
          href="/studio"
        >
          <Plus aria-hidden="true" className="size-5" />
          <span className="hidden xl:inline">
            {viewer?.creatorId ? "Nova publicação" : "Criar meu perfil"}
          </span>
        </Link>
      ) : null}
      <div className="mt-auto pt-8">
        <SidebarAccount viewer={viewer} />
      </div>
    </aside>
  );
}
