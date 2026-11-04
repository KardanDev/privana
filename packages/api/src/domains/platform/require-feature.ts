import { ORPCError } from "@orpc/server";
import type { Database } from "@privana/db";
import type { PlatformConfig } from "../../contracts/platform";
import { readPublishedConfig } from "./read-published-config";
export async function requirePlatformFeature(
  db: Database,
  feature: keyof PlatformConfig["features"]
): Promise<void> {
  const config = await readPublishedConfig(db);
  if (!config.features[feature]) {
    throw new ORPCError("FORBIDDEN", {
      message: "Esta funcionalidade está temporariamente desativada.",
    });
  }
}
