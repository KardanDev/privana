import type { Metadata } from "next";
import { connection } from "next/server";
import { loadPlatform } from "./load-platform";

export async function platformMetadata(): Promise<Metadata> {
  await connection();
  const config = await loadPlatform();
  return {
    applicationName: config.brand.name,
    description: config.discovery.description,
    icons: { icon: config.brand.logoUrl || "/favicon/favicon.svg" },
    title: {
      default: config.brand.name,
      template: `%s · ${config.brand.name}`,
    },
  };
}
