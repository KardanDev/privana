import "./fixture.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "@/components/providers";
import { AppShell } from "@/shared/layout/app-shell";
import { studioRouterPlatformConfig } from "../fixture-platform-config";

export const metadata: Metadata = { title: "Privana · Studio fixture" };

export default function FixtureLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <Providers platformConfig={studioRouterPlatformConfig}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
