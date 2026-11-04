import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

import { PrismaClient } from "../prisma/generated/client";
import type { DatabaseConfig } from "./config";

export function createPrismaClient(env: DatabaseConfig) {
  const adapter = new PrismaPostgresAdapter({
    connectionString: env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    // Cloud round trips can exceed Prisma's 5s default during multi-step signup.
    // Keep a bounded budget; long-running maintenance uses explicit batch limits.
    transactionOptions: { maxWait: 10_000, timeout: 20_000 },
  });
}

export type Database = ReturnType<typeof createPrismaClient>;
