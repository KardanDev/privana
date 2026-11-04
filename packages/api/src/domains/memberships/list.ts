import type { MembershipDTO } from "../../contracts/product";
import { protectedProcedure } from "../../index";
import { serializeCreator } from "../creators/serialize-creator";
import { creatorInclude, publicCreatorWhere } from "../shared/query-shapes";
import { effectiveSubscriptionStatus } from "./effective-status";
export const listMemberships = protectedProcedure.handler(
  async ({ context }) => {
    const now = new Date();
    const rows = await context.db.subscription.findMany({
      include: { creator: { include: creatorInclude } },
      orderBy: { createdAt: "desc" },
      take: 50,
      where: { creator: publicCreatorWhere, userId: context.viewer.id },
    });
    const subscriptions: MembershipDTO[] = await Promise.all(
      rows.map(async (row) => ({
        creator: await serializeCreator(
          context.db,
          row.creator,
          context.viewer.id
        ),
        expiresAt: row.expiresAt.toISOString(),
        id: row.id,
        status: effectiveSubscriptionStatus(row, now),
      }))
    );
    const interests = await context.db.membershipInterest.findMany({
      include: { creator: { include: creatorInclude } },
      orderBy: { createdAt: "desc" },
      take: 50,
      where: {
        creator: publicCreatorWhere,
        creatorId: { notIn: rows.map((row) => row.creatorId) },
        userId: context.viewer.id,
      },
    });
    const requests: MembershipDTO[] = await Promise.all(
      interests.map(async (row) => ({
        creator: await serializeCreator(
          context.db,
          row.creator,
          context.viewer.id
        ),
        expiresAt: null,
        id: row.id,
        status: "INTEREST_REGISTERED",
      }))
    );
    return [...subscriptions, ...requests].slice(0, 50);
  }
);
