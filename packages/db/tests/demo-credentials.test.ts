import { expect, test } from "bun:test";
import {
  mkdtemp,
  readdir,
  readFile,
  rmdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Prisma } from "../prisma/generated/client";
import { assertDemoSeedAllowed } from "../scripts/demo/assert-demo-seed-allowed";
import { demoAccounts } from "../scripts/demo/definitions";
import { isOwnedDemoUser } from "../scripts/demo/is-owned-demo-user";
import { prepareDemoCredentials } from "../scripts/demo/prepare-demo-credentials";
import { seedDemoUser } from "../scripts/demo/seed-demo-user";
import { writeDemoCredentials } from "../scripts/demo/write-demo-credentials";
import { createDemoDatabaseFixture } from "./demo-seed-fixture";

for (const env of [
  { DATABASE_URL: "test", NODE_ENV: "development" },
  { ALLOW_DEMO_SEED: "1", DATABASE_URL: "test", NODE_ENV: "production" },
  {
    ALLOW_DEMO_SEED: "1",
    DATABASE_URL: "test",
    NODE_ENV: "development",
    VERCEL_ENV: "production",
  },
  { ALLOW_DEMO_SEED: "1", NODE_ENV: "development" },
]) {
  test("demo seed refuses missing opt-in, production or absent database configuration", () => {
    expect(() => assertDemoSeedAllowed(env)).toThrow();
  });
}

test("credential generation is strong, private-file based and preserves passwords on repeat runs", async () => {
  const directory = await mkdtemp(join(tmpdir(), "privana-demo-test-"));
  const path = join(directory, "credentials.json");
  try {
    const first = await prepareDemoCredentials(path, demoAccounts);
    expect(first.accounts.length).toBe(10);
    expect(
      first.accounts.every((account) => account.password.length >= 32)
    ).toBe(true);
    expect(
      new Set(first.accounts.map((account) => account.password)).size
    ).toBe(first.accounts.length);
    await writeDemoCredentials(path, {
      ...first,
      seededAt: new Date().toISOString(),
      status: "ready",
    });
    const second = await prepareDemoCredentials(path, demoAccounts);
    expect(
      second.accounts.every(
        (account, index) => account.password === first.accounts[index]?.password
      )
    ).toBe(true);
    expect(second.status).toBe("pending");
    expect((await readdir(directory)).length).toBe(1);
    const parsed = JSON.parse(await readFile(path, "utf8")) as {
      status: string;
    };
    expect(parsed.status).toBe("ready");
  } finally {
    await Promise.all(
      (await readdir(directory)).map(
        async (file) => await unlink(join(directory, file))
      )
    );
    await rmdir(directory);
  }
});

test("malformed local credentials are not silently replaced", async () => {
  const directory = await mkdtemp(join(tmpdir(), "privana-demo-invalid-"));
  const path = join(directory, "credentials.json");
  try {
    await writeFile(path, "invalid-json");
    await expect(prepareDemoCredentials(path, demoAccounts)).rejects.toThrow(
      "inválido"
    );
    expect(await readFile(path, "utf8")).toBe("invalid-json");
  } finally {
    await unlink(path);
    await rmdir(directory);
  }
});

test("reserved identifiers never authorize changing a real account", async () => {
  const [definition] = demoAccounts;
  if (!definition) {
    throw new Error("No fixture account");
  }
  expect(
    isOwnedDemoUser(
      {
        email: "real@example.test",
        id: definition.userId,
        name: "A real person",
      },
      definition
    )
  ).toBe(false);
  const fixture = createDemoDatabaseFixture();
  fixture.tables.get("user")?.set(definition.userId, {
    email: "real@example.test",
    id: definition.userId,
    name: "A real person",
    role: "member",
  });
  await expect(
    seedDemoUser(
      fixture.db as unknown as Prisma.TransactionClient,
      definition,
      "test-only-unused-hash"
    )
  ).rejects.toThrow("outra conta");
  expect(fixture.tables.get("account")?.size).toBe(0);
});
