import { Prisma } from "@privana/db/client";

interface CreatorModerationTarget {
  id: string;
  status: string;
  userId: string;
  userRole: string;
}

export async function lockCreatorModerationTarget(
  tx: Prisma.TransactionClient,
  creatorId: string
): Promise<CreatorModerationTarget | null> {
  // Lock the owner too: a role grant must not race a staff-profile restriction.
  const targets = await tx.$queryRaw<CreatorModerationTarget[]>(Prisma.sql`
    SELECT creator."id", creator."status", creator."userId", owner."role" AS "userRole"
    FROM "CreatorProfile" AS creator
    JOIN "user" AS owner ON owner."id" = creator."userId"
    WHERE creator."id" = ${creatorId}
    FOR UPDATE OF creator, owner
  `);
  return targets[0] ?? null;
}
