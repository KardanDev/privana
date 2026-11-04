"use client";

import type { ViewerDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Skeleton } from "@privana/ui/components/skeleton";
import { Bell, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/shared/components/avatar";
import { usePlatform } from "@/shared/platform/use-platform";
import { useSignOut } from "./use-sign-out";

export function SidebarAccount({
  viewer,
}: {
  viewer: ViewerDTO | null | undefined;
}) {
  const config = usePlatform();
  const signOut = useSignOut();
  if (viewer === undefined) {
    return (
      <Skeleton
        aria-label="Carregando conta"
        className="h-12 w-full rounded-xl"
      />
    );
  }
  if (!viewer) {
    return (
      <div className="flex flex-col gap-3">
        <Button
          nativeButton={false}
          render={<Link aria-label="Entrar" href="/login" />}
          variant="outline"
        >
          <LogIn aria-hidden="true" />
          <span className="hidden xl:inline">Entrar</span>
        </Button>
        {config.features.registration ? (
          <Link
            className="hidden py-1 text-center font-medium text-primary text-sm hover:underline xl:block"
            href="/register"
          >
            Criar conta
          </Link>
        ) : null}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      <div className="flex flex-col items-center justify-center gap-2 xl:flex-row xl:justify-between">
        <Link
          aria-label="Notificações"
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          href="/notifications"
          title="Notificações"
        >
          <Bell aria-hidden="true" className="size-5" />
        </Link>
        <Button
          aria-label="Sair da conta"
          disabled={signOut.pending}
          onClick={signOut.signOut}
          size="icon"
          title="Sair da conta"
          variant="ghost"
        >
          <LogOut aria-hidden="true" />
        </Button>
      </div>
      <Link
        aria-label="Minha conta"
        className="flex items-center justify-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted xl:justify-start"
        href="/settings"
      >
        <Avatar name={viewer.name} size={40} src={viewer.image} />
        <span className="hidden min-w-0 xl:block">
          <span className="block truncate font-semibold text-sm">
            {viewer.name}
          </span>
          <span className="text-muted-foreground text-xs">Minha conta</span>
        </span>
      </Link>
    </div>
  );
}
