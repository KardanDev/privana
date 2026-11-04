import { Prisma } from "@privana/db/client";
import { z } from "zod";
import type { AnalyticsDTO } from "../../../contracts/platform";
import { financeProcedure } from "../../../index";
import { buildCurrencyTotals } from "./build-currency-totals";
import type { DailyAggregateRow } from "./build-daily-series";
import { buildDailySeries } from "./build-daily-series";
export const analyticsOverview = financeProcedure
  .input(
    z
      .object({
        days: z.union([z.literal(7), z.literal(30), z.literal(90)]).default(30),
      })
      .strict()
      .optional()
  )
  .handler(async ({ context, input }): Promise<AnalyticsDTO> => {
    const days = input?.days ?? 30;
    const now = new Date();
    const start = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - days + 1
      )
    );
    const end = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );
    const [
      users,
      creators,
      pendingCreators,
      posts,
      activeSubscriptions,
      openReports,
      dailyRows,
      currencyRows,
    ] = await Promise.all([
      context.db.user.count(),
      context.db.creatorProfile.count(),
      context.db.creatorProfile.count({ where: { status: "PENDING" } }),
      context.db.post.count({ where: { status: "PUBLISHED" } }),
      context.db.subscription.count({
        where: { expiresAt: { gt: now }, status: "ACTIVE" },
      }),
      context.db.report.count({ where: { status: "OPEN" } }),
      context.db.$queryRaw<DailyAggregateRow[]>(Prisma.sql`
   SELECT TO_CHAR("createdAt", 'YYYY-MM-DD') AS date, 'users' AS kind, COUNT(*)::int AS count FROM "user" WHERE "createdAt">=${start} AND "createdAt"<${end} GROUP BY 1
   UNION ALL SELECT TO_CHAR("createdAt", 'YYYY-MM-DD'), 'posts', COUNT(*)::int FROM "Post" WHERE "createdAt">=${start} AND "createdAt"<${end} AND "status"='PUBLISHED' GROUP BY 1
   UNION ALL SELECT TO_CHAR("createdAt", 'YYYY-MM-DD'), 'subscriptions', COUNT(*)::int FROM "Subscription" WHERE "createdAt">=${start} AND "createdAt"<${end} GROUP BY 1
   UNION ALL SELECT TO_CHAR("occurredAt", 'YYYY-MM-DD'), 'transactions', COUNT(*)::int FROM "TransactionRecord" WHERE "occurredAt">=${start} AND "occurredAt"<${end} GROUP BY 1
  `),
      context.db.transactionRecord.groupBy({
        _count: { _all: true },
        _sum: { amountMinor: true },
        by: ["currency", "kind", "status"],
      }),
    ]);
    return {
      currencies: buildCurrencyTotals(currencyRows),
      daily: buildDailySeries(dailyRows, days, now),
      days,
      totals: {
        activeSubscriptions,
        creators,
        openReports,
        pendingCreators,
        posts,
        users,
      },
    };
  });
