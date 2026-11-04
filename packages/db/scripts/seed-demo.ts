import { open, unlink } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPrismaClient } from "../src/index";
import { assertDemoCredentialsIgnored } from "./demo/assert-demo-credentials-ignored";
import { assertDemoSeedAllowed } from "./demo/assert-demo-seed-allowed";
import { demoAccounts } from "./demo/definitions";
import { describeDemoSeedError } from "./demo/describe-demo-seed-error";
import { prepareDemoCredentials } from "./demo/prepare-demo-credentials";
import { seedDemoData } from "./demo/seed-demo-data";
import { writeDemoCredentials } from "./demo/write-demo-credentials";

export async function seedDemo(): Promise<void> {
  const databaseUrl = assertDemoSeedAllowed(process.env);
  const workspace = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../.."
  );
  assertDemoCredentialsIgnored(workspace);
  const path = join(workspace, "apps/web/.local-demo-credentials.json");
  const lockPath = `${path}.lock`;
  const lock = await open(lockPath, "wx", 0o600);
  try {
    const credentials = await prepareDemoCredentials(path, demoAccounts);
    await writeDemoCredentials(path, credentials);
    const db = createPrismaClient({ DATABASE_URL: databaseUrl });
    try {
      await seedDemoData(db, credentials);
      await writeDemoCredentials(path, {
        ...credentials,
        seededAt: new Date().toISOString(),
        status: "ready",
      });
    } finally {
      await db.$disconnect();
    }
  } finally {
    await lock.close();
    await unlink(lockPath);
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    await seedDemo();
  } catch (error) {
    process.stderr.write(
      `Não foi possível preparar a demonstração. ${describeDemoSeedError(error)} Nenhuma credencial é exibida.\n`
    );
    process.exitCode = 1;
  }
}
