import type { MetadataRoute } from "next";
import { loadPlatform } from "@/shared/platform/load-platform";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await loadPlatform();
  return {
    background_color: "#ffffff",
    description: config.discovery.description,
    display: "standalone",
    icons: [
      {
        purpose: "any",
        sizes: "any",
        src: config.brand.logoUrl || "/favicon/favicon.svg",
      },
    ],
    name: config.brand.name,
    short_name: config.brand.name.slice(0, 24),
    start_url: "/",
    theme_color: config.brand.accentColor,
  };
}
