import type { Database } from "@privana/db";
import { readPlatformFeatures } from "@privana/db/read-platform-features";
import { APIError } from "better-auth/api";
export async function assertRegistrationEnabled(db: Database): Promise<void> {
  const features = await readPlatformFeatures(db);
  if (!features.registration) {
    throw new APIError("FORBIDDEN", {
      message: "Novos cadastros estão temporariamente desativados.",
    });
  }
}
