"use client";
import type { ViewerDTO } from "@privana/api/contracts/product";
import { cn } from "@privana/ui/lib/utils";
import { Compass, House, MessageCircle, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { GuardedLink } from "@/shared/navigation/guarded-link";
import { usePlatform } from "@/shared/platform/use-platform";
import { isNavigationActive } from "./is-navigation-active";
import { MobileAccountMenu } from "./mobile-account-menu";
import {
  mobileNavigationItemClassName,
  mobileNavigationLabelClassName,
} from "./mobile-navigation-styles";

const items = [
  { href: "/", icon: House, key: "home" },
  { href: "/explore", icon: Compass, key: "explore" },
  { href: "/studio", icon: Sparkles, key: "studio" },
  {
    href: "/messages",
    icon: MessageCircle,
    key: "messages",
  },
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
      className="fixed inset-x-0 bottom-0 z-40 flex items-start border-t bg-card px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {items
        .filter(
          (item) =>
            (item.href !== "/messages" || config.features.messaging) &&
            (item.href !== "/studio" ||
              Boolean(viewer.creatorId && viewer.creatorStatus === "ACTIVE"))
        )
        .map((item) => {
          const { href, icon: Icon } = item;
          const active = isNavigationActive(pathname, href);
          const label = config.navigation[item.key];
          return (
            <GuardedLink
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={cn(
                mobileNavigationItemClassName,
                active
                  ? "bg-accent font-semibold text-primary"
                  : "text-muted-foreground"
              )}
              href={href}
              key={href}
              title={label}
            >
              <Icon
                aria-hidden="true"
                className="size-5"
                strokeWidth={active ? 2.2 : 1.7}
              />
              <span className={mobileNavigationLabelClassName}>{label}</span>
            </GuardedLink>
          );
        })}
      <MobileAccountMenu viewer={viewer} />
    </nav>
  );
}
