import { createPrismaClient } from "../packages/db/src/index";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}
const db = createPrismaClient({ DATABASE_URL: databaseUrl });
try {
  const tables = await db.$queryRaw<
    { table_name: string }[]
  >`SELECT table_name::text FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  const checks = await db.$queryRaw<{ name: string }[]>`
    SELECT conname::text AS name FROM pg_constraint
    WHERE contype = 'c' AND connamespace = 'public'::regnamespace
    ORDER BY conname
  `;
  const triggers = await db.$queryRaw<{ name: string }[]>`
    SELECT tgname::text AS name FROM pg_trigger
    WHERE NOT tgisinternal AND tgrelid IN (
      SELECT oid FROM pg_class WHERE relnamespace = 'public'::regnamespace
      AND relname IN ('PlatformRevision', 'TransactionRecord')
    ) ORDER BY tgname
  `;
  process.stdout.write(
    `${JSON.stringify({ checks: checks.map((check) => check.name), tables: tables.map((table) => table.table_name), triggers: triggers.map((trigger) => trigger.name) })}\n`
  );
} finally {
  await db.$disconnect();
}
