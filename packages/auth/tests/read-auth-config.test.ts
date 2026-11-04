import { expect, test } from "bun:test";
import type { AuthConfig } from "../src/index";
import { readAuthConfig } from "../src/read-auth-config";

test("auth settings survive a getter-only environment proxy", () => {
  const settings: AuthConfig = {
    BETTER_AUTH_SECRET: "test-only-secret-at-least-32-characters",
    BETTER_AUTH_URL: "http://localhost:3001",
    EMAIL_DELIVERY_MODE: "resend",
    EMAIL_FROM: "Example <mail@example.test>",
    NODE_ENV: "development",
    RESEND_API_KEY: "test-only-key",
    UPSTASH_REDIS_REST_TOKEN: "test-only-redis-token",
    UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
  };
  const source = new Proxy({} as AuthConfig, {
    get: (_target, key) => settings[key as keyof AuthConfig],
  });
  expect(Object.keys(source)).toEqual([]);
  expect(readAuthConfig(source, "/tmp/preview")).toEqual({
    ...settings,
    EMAIL_PREVIEW_DIRECTORY: "/tmp/preview",
  });
});
