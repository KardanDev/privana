import { DM_Sans, Manrope } from "next/font/google";
import { connection } from "next/server";

import "../index.css";
import Providers from "@/components/providers";
import PwaRegistration from "@/components/pwa-registration";
import { AppShell } from "@/shared/layout/app-shell";
import { loadPlatform } from "@/shared/platform/load-platform";
import { platformMetadata } from "@/shared/platform/platform-metadata";

const bodyFont = DM_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const headingFont = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const generateMetadata = platformMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  const config = await loadPlatform();
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
      >
        <PwaRegistration />

        <Providers platformConfig={config}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
