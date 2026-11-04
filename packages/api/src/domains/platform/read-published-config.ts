import type { Database } from "@privana/db";
import {
  defaultPlatformConfig,
  platformConfigSchema,
} from "../../contracts/platform";

export async function readPublishedConfig(db: Database) {
  const document = await db.platformSettings.findUnique({
    select: { published: true },
    where: { id: "platform" },
  });
  return platformConfigSchema.parse(
    document?.published ?? defaultPlatformConfig
  );
}
