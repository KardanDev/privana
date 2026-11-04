import { createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import type { AuthConfig } from "../index";
import { CONSUME_SCRIPT } from "./consume-script";

type ExecuteRateLimit = (
  script: string,
  keys: string[],
  args: number[]
) => Promise<unknown>;
const responseSchema = z.tuple([
  z.number().int().min(0).max(1),
  z.number().int().nonnegative(),
]);

export function createRedisRateLimit(
  env: AuthConfig,
  execute?: ExecuteRateLimit
) {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!(url || token)) {
    return;
  }
  if (!(url && token)) {
    throw new Error("Configure a URL e o token do Upstash Redis juntos.");
  }
  const redis = new Redis({
    retry: { retries: 1 },
    signal: () => AbortSignal.timeout(5000),
    token,
    url,
  });
  return {
    consume: async (key: string, rule: { window: number; max: number }) => {
      // Hash IP/path identifiers with a secret; never store IPs in Redis keys.
      const digest = createHmac("sha256", env.BETTER_AUTH_SECRET)
        .update(`${env.BETTER_AUTH_URL}:${key}`)
        .digest("hex");
      if (
        !Number.isSafeInteger(rule.window) ||
        rule.window <= 0 ||
        !Number.isSafeInteger(rule.max) ||
        rule.max <= 0
      ) {
        throw new Error(
          "A regra de limite deve ter janela e máximo positivos."
        );
      }
      const run = execute ?? redis.eval.bind(redis);
      const result = await run(
        CONSUME_SCRIPT,
        [`privana:auth:rate:${digest}`],
        [rule.window * 1000, rule.max]
      );
      const [allowed, retryAfter] = responseSchema.parse(result);
      return {
        allowed: allowed === 1,
        retryAfter: allowed === 1 ? null : retryAfter,
      };
    },
  };
}
