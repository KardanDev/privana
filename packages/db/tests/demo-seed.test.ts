import { expect, test } from "bun:test";
import { verifyPassword } from "better-auth/crypto";
import { demoAccounts } from "../scripts/demo/definitions";
import type { DemoCredentials } from "../scripts/demo/prepare-demo-credentials";
import { seedDemoData } from "../scripts/demo/seed-demo-data";
import { createDemoDatabaseFixture } from "./demo-seed-fixture";

test("repeat seeding preserves existing creator data, authenticates roles and creates no financial records", async () => {
  const fixture = createDemoDatabaseFixture();
  fixture.tables.get("user")?.set("demo-luna-demo", {
    email: "luna-demo@demo.invalid",
    id: "demo-luna-demo",
    image: null,
    name: "Luna · demonstração",
    role: "member",
    status: "ACTIVE",
  });
  fixture.tables.get("creatorProfile")?.set("legacy-luna", {
    avatarUrl: "https://example.test/avatar.jpg",
    bio: "Bio customizada",
    handle: "luna-demo",
    id: "legacy-luna",
    isDemo: true,
    status: "ACTIVE",
    userId: "demo-luna-demo",
  });
  const credentials: DemoCredentials = {
    accounts: demoAccounts.map((entry) => ({
      ...entry,
      password: "P!test-only-not-a-real-login-password9a",
    })),
    createdAt: new Date().toISOString(),
    seededAt: null,
    status: "pending",
    version: 1,
  };
  await seedDemoData(fixture.db, credentials);
  const member = fixture.tables.get("user")?.get("demo-role-member");
  if (member) {
    member.name = "Nome editado no perfil";
  }
  const counts = [...fixture.tables].map(([model, table]) => [
    model,
    table.size,
  ]);
  await seedDemoData(fixture.db, credentials);
  expect(
    [...fixture.tables].map(([model, table]) => [model, table.size])
  ).toEqual(counts);
  expect(fixture.tables.get("creatorProfile")?.get("legacy-luna")?.bio).toBe(
    "Bio customizada"
  );
  expect(fixture.tables.get("user")?.size).toBe(10);
  expect(fixture.tables.get("user")?.get("demo-role-member")?.name).toBe(
    "Nome editado no perfil"
  );
  expect(
    fixture.tables.get("user") &&
      [...(fixture.tables.get("user")?.values() ?? [])].every(
        (user) => user.emailVerified === true
      )
  ).toBe(true);
  expect(fixture.tables.get("account")?.size).toBe(10);
  const account = fixture.tables
    .get("account")
    ?.get("demo-credential-demo-role-member");
  const password = credentials.accounts.find(
    (entry) => entry.key === "member"
  )?.password;
  if (typeof account?.password !== "string" || !password) {
    throw new Error("Credential fixture unavailable");
  }
  expect(await verifyPassword({ hash: account.password, password })).toBe(true);
  expect(account.password === password).toBe(false);
  expect(
    fixture.tables.get("creatorProfile") &&
      [...(fixture.tables.get("creatorProfile")?.values() ?? [])].every(
        (profile) => profile.isDemo === true
      )
  ).toBe(true);
  expect(fixture.tables.get("subscription")).toBeUndefined();
  expect(fixture.tables.get("transactionRecord")).toBeUndefined();
  expect(fixture.tables.get("membershipInterest")?.size).toBe(1);
  expect(fixture.tables.get("message")?.size).toBe(2);
}, 30_000);

test("a conflicting post identifier rolls back users and credentials instead of claiming real content", async () => {
  const fixture = createDemoDatabaseFixture();
  fixture.tables.get("post")?.set("demo-public-luna-demo", {
    body: "Real content",
    creatorId: "unrelated-creator",
    id: "demo-public-luna-demo",
  });
  const credentials: DemoCredentials = {
    accounts: demoAccounts.map((entry) => ({
      ...entry,
      password: "P!test-only-not-a-real-login-password9a",
    })),
    createdAt: new Date().toISOString(),
    seededAt: null,
    status: "pending",
    version: 1,
  };
  await expect(seedDemoData(fixture.db, credentials)).rejects.toThrow(
    "outro registro"
  );
  expect(fixture.tables.get("user")?.size).toBe(0);
  expect(fixture.tables.get("account")?.size).toBe(0);
  expect(fixture.tables.get("creatorProfile")?.size).toBe(0);
  expect(fixture.tables.get("post")?.get("demo-public-luna-demo")?.body).toBe(
    "Real content"
  );
}, 30_000);
