"use client";
import { cn } from "@privana/ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavigationActive } from "./is-navigation-active";

export function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  const pathname = usePathname();
  const active = isNavigationActive(pathname, href);
  return (
    <Link
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={cn(
        "group flex h-12 items-center justify-center gap-4 rounded-xl px-3 font-medium text-[15px] transition-colors xl:justify-start",
        active
          ? "bg-accent text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      href={href as Route}
      title={label}
    >
      <Icon
        aria-hidden="true"
        className="size-[23px] shrink-0"
        strokeWidth={active ? 2.2 : 1.7}
      />
      <span className="hidden truncate xl:inline">{label}</span>
    </Link>
  );
}
