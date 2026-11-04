import { expect, test } from "bun:test";
import type { AuthConfig } from "../src/index";
import { createRedisRateLimit } from "../src/rate-limit/create-redis-rate-limit";

const env: AuthConfig = {
  BETTER_AUTH_SECRET: "test-only-secret-that-is-long-enough",
  BETTER_AUTH_URL: "https://privana.test",
  NODE_ENV: "test",
  UPSTASH_REDIS_REST_TOKEN: "test-only-token",
  UPSTASH_REDIS_REST_URL: "https://unused.upstash.io",
};
const KEY_FORMAT = /^privana:auth:rate:[a-f0-9]{64}$/;

test("Redis is optional locally, but incomplete configuration is rejected", () => {
  expect(
    createRedisRateLimit({
      ...env,
      UPSTASH_REDIS_REST_TOKEN: undefined,
      UPSTASH_REDIS_REST_URL: undefined,
    })
  ).toBeUndefined();
  expect(() =>
    createRedisRateLimit({ ...env, UPSTASH_REDIS_REST_TOKEN: undefined })
  ).toThrow();
  expect(() =>
    createRedisRateLimit({ ...env, UPSTASH_REDIS_REST_URL: undefined })
  ).toThrow();
});

test("rate limits use a single atomic command, secret-hashed identifiers and millisecond expiry", async () => {
  const commands: { script: string; keys: string[]; args: number[] }[] = [];
  const limiter = createRedisRateLimit(env, (script, keys, args) => {
    commands.push({ args, keys, script });
    return Promise.resolve([0, 17]);
  });
  expect(
    await limiter?.consume("203.0.113.12/sign-in/email", { max: 5, window: 60 })
  ).toEqual({ allowed: false, retryAfter: 17 });
  expect(commands).toHaveLength(1);
  expect(commands[0]?.keys[0]).toMatch(KEY_FORMAT);
  expect(commands[0]?.keys[0]).not.toContain("203.0.113.12");
  expect(commands[0]?.args).toEqual([60_000, 5]);
  expect(commands[0]?.script).toContain("redis.call('INCR'");
});

test("Redis errors and malformed replies cannot silently disable login limits", async () => {
  const outage = createRedisRateLimit(env, () =>
    Promise.reject(new Error("unavailable"))
  );
  await expect(
    outage?.consume("login", { max: 5, window: 60 })
  ).rejects.toThrow("unavailable");
  const malformed = createRedisRateLimit(env, () =>
    Promise.resolve(["yes", 0])
  );
  await expect(
    malformed?.consume("login", { max: 5, window: 60 })
  ).rejects.toThrow();
});

test("environments have independent counters while server instances share the same counter", async () => {
  const keys: string[] = [];
  const execute = (_script: string, identifiers: string[], _args: number[]) => {
    keys.push(identifiers[0] ?? "");
    return Promise.resolve([1, 0]);
  };
  const rule = { max: 5, window: 60 };
  const one = createRedisRateLimit(env, execute);
  const two = createRedisRateLimit(env, execute);
  const preview = createRedisRateLimit(
    { ...env, BETTER_AUTH_URL: "https://preview.privana.test" },
    execute
  );
  expect(await one?.consume("login", rule)).toEqual({
    allowed: true,
    retryAfter: null,
  });
  await two?.consume("login", rule);
  await preview?.consume("login", rule);
  expect(keys[0]).toBe(keys[1]);
  expect(keys[2]).not.toBe(keys[0]);
});
