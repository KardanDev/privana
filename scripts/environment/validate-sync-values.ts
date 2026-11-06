import { isPlaceholderValue } from "./is-placeholder-value";
import { isPrivateHost } from "./is-private-host";
import type { SyncTarget } from "./sync-types";
import { validateSyncEndpoint } from "./validate-sync-endpoint";

const CONTROL_CHARACTERS = /[\r\n\0]/;
const EMAIL_ADDRESS = /(?:^|<)([^\s<>@]+@([^\s<>@]+))>?$/;
export function validateSyncValues(
  values: Map<string, string>,
  target: SyncTarget
): void {
  for (const [key, value] of values) {
    if (CONTROL_CHARACTERS.test(value) || isPlaceholderValue(value)) {
      throw new Error(`${key} contains an unsupported or sample value.`);
    }
  }
  if ((values.get("BETTER_AUTH_SECRET")?.length ?? 0) < 32) {
    throw new Error(
      "BETTER_AUTH_SECRET requires an independently generated secret."
    );
  }
  const databaseUrl = values.get("DATABASE_URL");
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }
  validateSyncEndpoint("DATABASE_URL", databaseUrl, target);
  const mode = values.get("EMAIL_DELIVERY_MODE") ?? "preview";
  if (
    !["preview", "resend"].includes(mode) ||
    (target !== "development" && mode !== "resend")
  ) {
    throw new Error("EMAIL_DELIVERY_MODE must be resend for hosted targets.");
  }
  if (mode === "resend") {
    if (!values.get("RESEND_API_KEY")) {
      throw new Error("RESEND_API_KEY is required for resend delivery.");
    }
    const sender = values.get("EMAIL_FROM")?.match(EMAIL_ADDRESS);
    if (!sender?.[2] || isPrivateHost(sender[2])) {
      throw new Error(
        "EMAIL_FROM requires an address on your verified sending domain."
      );
    }
  }
  const redisUrl = values.get("UPSTASH_REDIS_REST_URL");
  const redisToken = values.get("UPSTASH_REDIS_REST_TOKEN");
  if (Boolean(redisUrl) !== Boolean(redisToken)) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured together."
    );
  }
  if (redisUrl) {
    validateSyncEndpoint("UPSTASH_REDIS_REST_URL", redisUrl, target);
  }
}
