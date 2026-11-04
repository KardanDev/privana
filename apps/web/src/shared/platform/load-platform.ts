import "server-only";

import { defaultPlatformConfig } from "@privana/api/contracts/platform";
import { readPublishedConfig } from "@privana/api/domains/platform/read-published-config";
import { cache } from "react";
import { db } from "@/services";

// Keep the shell readable during outages; product queries surface their own
// errors rather than replacing missing data with fabricated records.
export const loadPlatform = cache(async () => {
  try {
    return await readPublishedConfig(db);
  } catch {
    return defaultPlatformConfig;
  }
});
