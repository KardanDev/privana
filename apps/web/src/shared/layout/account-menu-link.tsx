"use client";

import { DropdownMenuItem } from "@privana/ui/components/dropdown-menu";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavigationActive } from "./is-navigation-active";

export function AccountMenuLink({
  href,
  icon: Icon,
  label,
}: {
  href: Route;
  icon: LucideIcon;
  label: string;
}) {
  const active = isNavigationActive(usePathname(), href);
  return (
    <DropdownMenuItem
      aria-current={active ? "page" : undefined}
      render={<Link href={href} />}
    >
      <Icon aria-hidden="true" />
      <span className="min-w-0">{label}</span>
    </DropdownMenuItem>
  );
}
