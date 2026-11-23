import type { ReactNode } from "react";
import { GuardedLink } from "@/shared/navigation/guarded-link";

const appPaths = new Set([
  "/",
  "/admin",
  "/checkout",
  "/dashboard",
  "/explore",
  "/feed",
  "/forgot-password",
  "/login",
  "/memberships",
  "/messages",
  "/notifications",
  "/register",
  "/reset-password",
  "/saved",
  "/settings",
  "/studio",
  "/success",
  "/verify-email",
]);
const detailPath = /^\/(?:checkout|creators|pages)\/[a-z0-9_-]+$/;
const urlSuffix = /[?#]/;
const trailingSlash = /\/$/;

export function PlatformLink({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className: string;
  href: string;
}) {
  const [path = ""] = href.split(urlSuffix, 1);
  const pathname =
    path === "/" || path.startsWith("//")
      ? path
      : path.replace(trailingSlash, "");
  if (appPaths.has(pathname) || detailPath.test(pathname)) {
    return (
      <GuardedLink className={className} href={href} prefetch={false}>
        {children}
      </GuardedLink>
    );
  }

  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}
