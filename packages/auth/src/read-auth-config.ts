import type { AuthConfig } from "./index";

export function readAuthConfig(
  source: AuthConfig,
  previewDirectory?: string
): AuthConfig {
  // Varlock's ENV proxy exposes getters, but has no enumerable own keys.
  // Read each setting explicitly; spreading the proxy silently loses them.
  return {
    BETTER_AUTH_SECRET: source.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: source.BETTER_AUTH_URL,
    EMAIL_DELIVERY_MODE: source.EMAIL_DELIVERY_MODE,
    EMAIL_FROM: source.EMAIL_FROM,
    EMAIL_PREVIEW_DIRECTORY: previewDirectory ?? source.EMAIL_PREVIEW_DIRECTORY,
    NODE_ENV: source.NODE_ENV,
    RESEND_API_KEY: source.RESEND_API_KEY,
    UPSTASH_REDIS_REST_TOKEN: source.UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL: source.UPSTASH_REDIS_REST_URL,
  };
}
