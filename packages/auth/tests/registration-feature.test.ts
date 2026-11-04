import { expect, test } from "bun:test";
import type { Database } from "@privana/db";
import { readPlatformBrand } from "@privana/db/read-platform-brand";
import { assertRegistrationEnabled } from "../src/assert-registration-enabled";
import { renderAuthEmail } from "../src/email/render-auth-email";
import { createAuth } from "../src/index";

test("the actual auth user-create hook enforces closed registration", async () => {
  const db = {
    platformSettings: {
      findUnique: () => ({
        published: {
          features: {
            creatorApplications: true,
            messaging: true,
            registration: false,
          },
        },
      }),
    },
  } as unknown as Database;
  const auth = createAuth(
    {
      BETTER_AUTH_SECRET: "test-secret-only-for-local-tests-1234567890",
      BETTER_AUTH_URL: "http://localhost:3001",
      NODE_ENV: "test",
    },
    db
  );
  const before = auth.options.databaseHooks?.user?.create?.before;
  expect(before).toBeFunction();
  if (!before) {
    throw new Error("Registration guard is missing");
  }
  await expect(
    before(
      {
        createdAt: new Date(),
        email: "test@example.test",
        emailVerified: false,
        id: "test",
        name: "Test",
        updatedAt: new Date(),
      },
      null
    )
  ).rejects.toMatchObject({ status: "FORBIDDEN" });
});

test("registration uses published flags and ignores an enabled draft", async () => {
  const db = {
    platformSettings: {
      findUnique: () => ({
        draft: { features: { registration: true } },
        published: {
          features: {
            creatorApplications: true,
            messaging: true,
            registration: false,
          },
        },
      }),
    },
  } as unknown as Database;
  await expect(assertRegistrationEnabled(db)).rejects.toMatchObject({
    status: "FORBIDDEN",
  });
});
test("first installation registration is enabled without a settings row", async () => {
  const db = {
    platformSettings: { findUnique: () => null },
  } as unknown as Database;
  expect(await assertRegistrationEnabled(db)).toBeUndefined();
});
test("invalid published settings fail closed rather than reopening registration", async () => {
  const db = {
    platformSettings: {
      findUnique: () => ({
        published: { features: { registration: "false" } },
      }),
    },
  } as unknown as Database;
  await expect(assertRegistrationEnabled(db)).rejects.toThrow();
});
test("auth messages use the published brand and escape it in HTML", async () => {
  const db = {
    platformSettings: {
      findUnique: () => ({
        draft: { brand: { name: "Rascunho" } },
        published: { brand: { name: "Minha <comunidade>" } },
      }),
    },
  } as unknown as Database;
  const brandName = await readPlatformBrand(db);
  const message = renderAuthEmail({
    brandName,
    kind: "reset",
    name: "Alice",
    url: "https://example.test/reset",
  });
  expect(message.subject).toContain(brandName);
  expect(message.html).toContain("Minha &lt;comunidade&gt;");
  expect(message.html).not.toContain("Minha <comunidade>");
  expect(message.text).toContain(brandName);
});
