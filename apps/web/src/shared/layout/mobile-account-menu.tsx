"use client";

import type { ViewerDTO } from "@privana/api/contracts/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@privana/ui/components/dropdown-menu";
import { cn } from "@privana/ui/lib/utils";
import {
  Bookmark,
  Heart,
  LogOut,
  Moon,
  Settings,
  ShieldCheck,
  SquarePen,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useToggleTheme } from "@/shared/appearance/use-toggle-theme";
import { usePlatform } from "@/shared/platform/use-platform";
import { AccountMenuLink } from "./account-menu-link";
import { getStudioEntry } from "./get-studio-entry";
import { isNavigationActive } from "./is-navigation-active";
import {
  mobileNavigationItemClassName,
  mobileNavigationLabelClassName,
} from "./mobile-navigation-styles";
import { useSignOut } from "./use-sign-out";

export function MobileAccountMenu({ viewer }: { viewer: ViewerDTO }) {
  const config = usePlatform();
  const pathname = usePathname();
  const signOut = useSignOut();
  const toggleTheme = useToggleTheme();
  const studio = getStudioEntry(
    viewer,
    config.features.creatorApplications,
    config.navigation.studio
  );
  const active =
    ["/settings", "/saved", "/memberships"].some((href) =>
      isNavigationActive(pathname, href)
    ) ||
    (isNavigationActive(pathname, "/studio") &&
      !(viewer.creatorId && viewer.creatorStatus === "ACTIVE"));
  const isStaff = ["admin", "editor", "moderator", "analyst"].includes(
    viewer.role
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          mobileNavigationItemClassName,
          "data-popup-open:bg-accent data-popup-open:font-semibold data-popup-open:text-primary",
          active
            ? "bg-accent font-semibold text-primary"
            : "text-muted-foreground"
        )}
      >
        <UserRound aria-hidden="true" className="size-5" />
        <span className={mobileNavigationLabelClassName}>Conta</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{viewer.name}</DropdownMenuLabel>
          <AccountMenuLink
            href="/saved"
            icon={Bookmark}
            label={config.navigation.saved}
          />
          <AccountMenuLink
            href="/memberships"
            icon={Heart}
            label={config.navigation.memberships}
          />
          <AccountMenuLink
            href="/settings"
            icon={Settings}
            label="Configurações"
          />
          {studio ? (
            <AccountMenuLink
              href="/studio"
              icon={SquarePen}
              label={studio.label}
            />
          ) : null}
          {isStaff ? (
            <AccountMenuLink
              href="/admin"
              icon={ShieldCheck}
              label="Administração"
            />
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={toggleTheme}>
            <Moon aria-hidden="true" /> Alternar tema claro ou escuro
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={signOut.pending}
            onClick={signOut.signOut}
          >
            <LogOut aria-hidden="true" />{" "}
            {signOut.pending ? "Saindo…" : "Sair da conta"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
