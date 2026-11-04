"use client";
import type { ViewerDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Skeleton } from "@privana/ui/components/skeleton";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/shared/components/brand";
import { usePlatform } from "@/shared/platform/use-platform";
import { MobileAccountMenu } from "./mobile-account-menu";
export function Topbar({ viewer }: { viewer: ViewerDTO | null | undefined }) {
  const config = usePlatform();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-card/95 px-4 backdrop-blur-xl sm:px-5 lg:hidden">
      <Brand />
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {viewer === undefined ? (
          <Skeleton className="h-10 w-24 rounded-full" />
        ) : null}
        {viewer ? (
          <>
            <Link
              aria-label="Notificações"
              className="flex size-10 items-center justify-center rounded-full border bg-card transition-colors hover:bg-accent"
              href="/notifications"
            >
              <Bell aria-hidden="true" className="size-[18px]" />
            </Link>
            <MobileAccountMenu viewer={viewer} />
          </>
        ) : null}
        {viewer === null ? (
          <>
            <Link
              className="px-2 py-2 font-semibold text-xs sm:text-sm"
              href="/login"
            >
              Entrar
            </Link>
            {config.features.registration ? (
              <Button
                nativeButton={false}
                render={<Link href="/register" />}
                size="sm"
              >
                Criar conta
              </Button>
            ) : null}
          </>
        ) : null}
      </div>
    </header>
  );
}
