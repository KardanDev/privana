import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyPassword } from "better-auth/crypto";
import { createPrismaClient } from "../src/index";
import { assertDemoSeedAllowed } from "./demo/assert-demo-seed-allowed";
import { demoAccounts } from "./demo/definitions";
import { describeDemoSeedError } from "./demo/describe-demo-seed-error";
import { prepareDemoCredentials } from "./demo/prepare-demo-credentials";

export async function verifyDemo(): Promise<void> {
  const databaseUrl = assertDemoSeedAllowed(process.env);
  const path = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../../apps/web/.local-demo-credentials.json"
  );
  const manifest: unknown = JSON.parse(await readFile(path, "utf8"));
  if (
    !manifest ||
    typeof manifest !== "object" ||
    !("status" in manifest) ||
    manifest.status !== "ready"
  ) {
    throw new Error("A demonstração ainda não foi preparada.");
  }
  const credentials = await prepareDemoCredentials(path, demoAccounts);
  const db = createPrismaClient({ DATABASE_URL: databaseUrl });
  try {
    const ids = demoAccounts.map((account) => account.userId);
    const users = await db.user.findMany({
      include: { accounts: { where: { providerId: "credential" } } },
      where: { id: { in: ids } },
    });
    const verifiedAccounts = await Promise.all(
      demoAccounts.map(async (definition) => {
        const user = users.find((entry) => entry.id === definition.userId);
        const credential = credentials.accounts.find(
          (entry) => entry.userId === definition.userId
        );
        const hash = user?.accounts[0]?.password;
        const valid = Boolean(
          user?.email === definition.email &&
            user.role === definition.role &&
            user.emailVerified &&
            user.status === "ACTIVE" &&
            user.accounts.length === 1 &&
            credential &&
            hash &&
            (await verifyPassword({ hash, password: credential.password }))
        );
        return { account: definition.key, valid };
      })
    );
    const [profiles, posts, comments, messages, notifications, reports] =
      await Promise.all([
        db.creatorProfile.count({
          where: { isDemo: true, userId: { in: ids } },
        }),
        db.post.count({ where: { creator: { userId: { in: ids } } } }),
        db.comment.count({ where: { id: { startsWith: "demo-" } } }),
        db.message.count({ where: { id: { startsWith: "demo-" } } }),
        db.notification.count({ where: { id: { startsWith: "demo-" } } }),
        db.report.count({ where: { id: { startsWith: "demo-" } } }),
      ]);
    process.stdout.write(
      `${JSON.stringify({ accounts: verifiedAccounts, records: { comments, messages, notifications, posts, profiles, reports } })}\n`
    );
    if (verifiedAccounts.some((account) => !account.valid)) {
      throw new Error("Uma conta de demonstração não passou na verificação.");
    }
  } finally {
    await db.$disconnect();
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    await verifyDemo();
  } catch (error) {
    process.stderr.write(
      `Falha na verificação. ${describeDemoSeedError(error)}\n`
    );
    process.exitCode = 1;
  }
}
