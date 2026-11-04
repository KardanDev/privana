import { z } from "zod";
import type { Database } from "./index";

const featuresSchema = z.object({
  creatorApplications: z.boolean(),
  messaging: z.boolean(),
  registration: z.boolean(),
});
export async function readPlatformFeatures(db: Database) {
  const document = await db.platformSettings.findUnique({
    select: { published: true },
    where: { id: "platform" },
  });
  if (!document) {
    return { creatorApplications: true, messaging: true, registration: true };
  }
  return z.object({ features: featuresSchema }).parse(document.published)
    .features;
}
