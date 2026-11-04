"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PlatformAnnouncement } from "@/shared/platform/platform-announcement";
import { PlatformFooter } from "@/shared/platform/platform-footer";
import { orpc } from "@/utils/orpc";
import { MobileNavigation } from "./mobile-navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

const authPaths = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]);
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const viewer = useQuery(orpc.viewer.get.queryOptions());
  if (pathname.startsWith("/admin")) {
    return children;
  }
  if (authPaths.has(pathname)) {
    return <main id="main-content">{children}</main>;
  }
  return (
    <>
      <a
        className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only"
        href="#main-content"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto max-w-[1280px]">
        <Sidebar viewer={viewer.data} />
        <div className="min-h-svh border-transparent border-x lg:ml-[88px] lg:border-border xl:ml-[216px]">
          <Topbar viewer={viewer.data} />
          <PlatformAnnouncement />
          <main
            className={
              pathname === "/" ||
              pathname === "/explore" ||
              pathname === "/feed" ||
              pathname === "/saved" ||
              pathname.startsWith("/creators/")
                ? "min-h-[70svh]"
                : "min-h-[70svh] px-4 py-6 sm:px-6 lg:py-8"
            }
            id="main-content"
          >
            {children}
          </main>
          <div className="pb-24 lg:pb-0">
            <PlatformFooter />
          </div>
        </div>
      </div>
      <MobileNavigation />
    </>
  );
}
