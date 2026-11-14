"use client";
import type { ViewerDTO } from "@privana/api/contracts/product";
import { cn } from "@privana/ui/lib/utils";
import {
  Compass,
  House,
  MessageCircle,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlatform } from "@/shared/platform/use-platform";
import { isNavigationActive } from "./is-navigation-active";

const items = [
  { href: "/", icon: House, key: "home", label: "Início" },
  { href: "/explore", icon: Compass, key: "explore", label: "Explorar" },
  { href: "/studio", icon: Sparkles, key: "studio", label: "Estúdio" },
  {
    href: "/messages",
    icon: MessageCircle,
    key: "messages",
    label: "Mensagens",
  },
  { href: "/settings", icon: UserRound, label: "Perfil" },
] as const;
export function MobileNavigation({
  viewer,
}: {
  viewer: ViewerDTO | null | undefined;
}) {
  const pathname = usePathname();
  const config = usePlatform();
  if (!viewer) {
    return null;
  }
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-card/95 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden"
    >
      {items
        .filter(
          (item) => item.href !== "/messages" || config.features.messaging
        )
        .map((item) => {
          const { href, icon: Icon } = item;
          const active = isNavigationActive(pathname, href);
          const label =
            "key" in item ? config.navigation[item.key] : item.label;
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1 text-[10px]",
                active
                  ? "bg-accent font-semibold text-primary"
                  : "text-muted-foreground"
              )}
              href={href}
              key={href}
            >
              <Icon
                aria-hidden="true"
                className="size-5"
                strokeWidth={active ? 2.2 : 1.7}
              />
              <span className="max-w-full truncate">{label}</span>
            </Link>
          );
        })}
    </nav>
  );
}
