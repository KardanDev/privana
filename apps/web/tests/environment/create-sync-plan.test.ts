import { expect, test } from "bun:test";
import { createSyncPlan } from "../../../../scripts/environment/create-sync-plan";
import { createValidEnvironment } from "./create-valid-environment";

test("the deployment allowlist excludes internal, derived and unrelated local values", () => {
  const plan = createSyncPlan(
    [
      {
        ...createValidEnvironment(),
        BETTER_AUTH_URL: "http://localhost:3001",
        CLAIM_URL: "https://provider.test/claim/never-publish",
        EMAIL_PREVIEW_DIRECTORY: ".local-mail",
        NODE_ENV: "development",
        UNDECLARED_SECRET: "never-publish-this",
        VERCEL_URL: "localhost:3001",
      },
    ],
    "preview"
  );
  expect(plan.entries.map((entry) => entry.key)).toEqual([
    "BETTER_AUTH_SECRET",
    "DATABASE_URL",
    "EMAIL_DELIVERY_MODE",
    "EMAIL_FROM",
    "RESEND_API_KEY",
  ]);
  expect(plan.skippedCount).toBe(6);
});

test("later files explicitly override earlier values and empty optional values are not deleted", () => {
  const original = createValidEnvironment();
  const plan = createSyncPlan(
    [
      { ...original, UPSTASH_BLOB_TOKEN: "not-used-by-a-provider" },
      { EMAIL_FROM: "Privana <ops@privana.com>", UPSTASH_BLOB_TOKEN: "" },
    ],
    "production"
  );
  expect(plan.entries.find((entry) => entry.key === "EMAIL_FROM")?.value).toBe(
    "Privana <ops@privana.com>"
  );
  expect(plan.entries.some((entry) => entry.key === "UPSTASH_BLOB_TOKEN")).toBe(
    false
  );
  expect(original.EMAIL_FROM).toBe("Privana <mail@privana.com>");
});

test("hosted targets require a complete non-preview email configuration", () => {
  for (const target of ["preview", "production"] as const) {
    expect(() =>
      createSyncPlan(
        [{ ...createValidEnvironment(), EMAIL_DELIVERY_MODE: "preview" }],
        target
      )
    ).toThrow("EMAIL_DELIVERY_MODE");
    expect(() =>
      createSyncPlan(
        [{ ...createValidEnvironment(), RESEND_API_KEY: "" }],
        target
      )
    ).toThrow("RESEND_API_KEY");
  }
  expect(() =>
    createSyncPlan(
      [{ ...createValidEnvironment(), EMAIL_DELIVERY_MODE: "preview" }],
      "development"
    )
  ).not.toThrow();
});

test("missing required fields, short secrets and known sample values are rejected without echoing them", () => {
  const cases = [
    { BETTER_AUTH_SECRET: "" },
    { BETTER_AUTH_SECRET: "short-never-print" },
    {
      BETTER_AUTH_SECRET: "replace-with-a-random-secret-at-least-32-characters",
    },
    { DATABASE_URL: "postgres://YOUR_USER:YOUR_PASSWORD@YOUR_HOST/db" },
    { RESEND_API_KEY: "re_test_only_never_print" },
    { EMAIL_FROM: "Privana <mail@example.com>" },
  ];
  for (const values of cases) {
    let message = "";
    try {
      createSyncPlan(
        [{ ...createValidEnvironment(), ...values }],
        "production"
      );
    } catch (error) {
      message = error instanceof Error ? error.message : "unexpected";
    }
    expect(message).not.toBe("");
    expect(message).not.toContain("never_print");
    expect(message).not.toContain("never-print");
    expect(message).not.toContain("YOUR_PASSWORD");
  }
});

test("hosted database and Redis URLs reject private, loopback, sample or unencrypted endpoints", () => {
  for (const host of [
    "localhost",
    "app.localhost",
    "127.0.0.1",
    "127.1",
    "10.0.0.1",
    "172.20.1.2",
    "192.168.1.4",
    "169.254.169.254",
    "[::1]",
    "[fd12::1]",
    "[::ffff:127.0.0.1]",
    "db.example.com",
    "db.test",
  ]) {
    expect(() =>
      createSyncPlan(
        [
          {
            ...createValidEnvironment(),
            DATABASE_URL: `postgres://qa:offline-password@${host}/postgres?sslmode=require`,
          },
        ],
        "preview"
      )
    ).toThrow("DATABASE_URL");
  }
  expect(() =>
    createSyncPlan(
      [
        {
          ...createValidEnvironment(),
          DATABASE_URL: "postgres://qa:offline-password@db.prisma.io/postgres",
        },
      ],
      "production"
    )
  ).toThrow("DATABASE_URL");
  expect(() =>
    createSyncPlan(
      [
        {
          ...createValidEnvironment(),
          UPSTASH_REDIS_REST_TOKEN: "opaque-token",
          UPSTASH_REDIS_REST_URL: "http://redis.upstash.io",
        },
      ],
      "preview"
    )
  ).toThrow("UPSTASH_REDIS_REST_URL");
});

test("paired Redis configuration is validated and quoted values retain their exact bytes", () => {
  expect(() =>
    createSyncPlan(
      [{ ...createValidEnvironment(), UPSTASH_REDIS_REST_TOKEN: "only-token" }],
      "production"
    )
  ).toThrow("together");
  const plan = createSyncPlan(
    [
      {
        ...createValidEnvironment(),
        UPSTASH_BLOB_TOKEN: "opaque$token`with spaces`",
        UPSTASH_REDIS_REST_TOKEN: "opaque-token",
        UPSTASH_REDIS_REST_URL: "https://redis.upstash.io",
      },
    ],
    "production"
  );
  expect(
    plan.entries.find((entry) => entry.key === "UPSTASH_BLOB_TOKEN")?.value
  ).toBe("opaque$token`with spaces`");
  expect(() =>
    createSyncPlan(
      [{ ...createValidEnvironment(), UPSTASH_BLOB_TOKEN: "opaque\nvalue" }],
      "production"
    )
  ).toThrow("UPSTASH_BLOB_TOKEN");
});
