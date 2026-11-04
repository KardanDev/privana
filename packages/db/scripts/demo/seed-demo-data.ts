import { hashPassword } from "better-auth/crypto";
import type { Database } from "../../src/index";
import { demoAccounts, demoCreators } from "./definitions";
import type { DemoCredentials } from "./prepare-demo-credentials";
import { seedCommunityHistory } from "./seed-community-history";
import { seedCreatorHistory } from "./seed-creator-history";
import { seedDemoProfile } from "./seed-demo-profile";
import { seedDemoSocial } from "./seed-demo-social";
import { seedDemoUser } from "./seed-demo-user";
export async function seedDemoData(
  db: Database,
  credentials: DemoCredentials
): Promise<void> {
  const hashes = await Promise.all(
    demoAccounts.map(async (definition) => {
      const credential = credentials.accounts.find(
        (account) => account.userId === definition.userId
      );
      if (!credential || credential.email !== definition.email) {
        throw new Error(
          "Uma credencial de demonstração está ausente ou divergente."
        );
      }
      return {
        definition,
        passwordHash: await hashPassword(credential.password),
      };
    })
  );
  await db.$transaction(
    async (tx) => {
      await Promise.all(
        hashes.map(
          async (account) =>
            await seedDemoUser(tx, account.definition, account.passwordHash)
        )
      );
      const now = new Date();
      const creators = await Promise.all(
        demoCreators.map(
          async (creator, index) =>
            await seedDemoProfile(tx, creator, index, now)
        )
      );
      await seedDemoSocial(tx, creators, now);
    },
    { maxWait: 10_000, timeout: 60_000 }
  );
  const now = new Date();
  // Commit each creator's history independently so large seeds fit cloud transaction limits.
  for (const [index, creator] of demoCreators.entries()) {
    // biome-ignore lint/performance/noAwaitInLoops: Bound cloud connections and make each batch independently retryable.
    await db.$transaction(
      async (tx) => {
        await seedCreatorHistory(tx, creator, index, now);
        await seedCommunityHistory(tx, creator, index, now);
      },
      { maxWait: 10_000, timeout: 30_000 }
    );
    process.stdout.write(`Demo history: ${index + 1}/${demoCreators.length}\n`);
  }
}
