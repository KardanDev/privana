"use client";

import { DropdownMenuItem } from "@privana/ui/components/dropdown-menu";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { GuardedLink } from "@/shared/navigation/guarded-link";
import { isNavigationActive } from "./is-navigation-active";

export function AccountMenuLink({
  fallbackFocusRef,
  href,
  icon: Icon,
  label,
}: {
  fallbackFocusRef: RefObject<HTMLElement | null>;
  href: Route;
  icon: LucideIcon;
  label: string;
}) {
  const active = isNavigationActive(usePathname(), href);
  return (
    <DropdownMenuItem
      aria-current={active ? "page" : undefined}
      render={<GuardedLink fallbackFocusRef={fallbackFocusRef} href={href} />}
    >
      <Icon aria-hidden="true" />
      <span className="min-w-0">{label}</span>
    </DropdownMenuItem>
  );
}
