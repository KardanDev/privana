import { connection } from "next/server";
import type { CSSProperties } from "react";

import "../index.css";
import Providers from "@/components/providers";
import PwaRegistration from "@/components/pwa-registration";
import { AppShell } from "@/shared/layout/app-shell";
import { loadPlatform } from "@/shared/platform/load-platform";
import { platformMetadata } from "@/shared/platform/platform-metadata";
import { bodyFont } from "@/shared/theme/body-font";
import { headingFont } from "@/shared/theme/heading-font";

export const generateMetadata = platformMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  const config = await loadPlatform();
  const themeStyle: CSSProperties & { "--brand-accent": string } = {
    "--brand-accent": config.brand.accentColor,
  };
  return (
    <html
      className={`${bodyFont.variable} ${headingFont.variable}`}
      lang="pt-BR"
      style={themeStyle}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <PwaRegistration />

        <Providers platformConfig={config}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
