import type { Prisma } from "@privana/db/client";
import type {
  OperationsPageDTO,
  OperationsSubscriptionDTO,
} from "../../../contracts/platform";
import { financeProcedure } from "../../../index";
import { effectiveSubscriptionStatus } from "../../memberships/effective-status";
import {
  operationsInput,
  operationsPageSize,
  subscriptionStatusFilter,
} from "./query-shapes";
export const operationsSubscriptions = financeProcedure
  .input(
    operationsInput.extend({ status: subscriptionStatusFilter }).optional()
  )
  .handler(
    async ({
      context,
      input,
    }): Promise<OperationsPageDTO<OperationsSubscriptionDTO>> => {
      const page = input?.page ?? 0;
      const search = input?.search;
      const now = new Date();
      const where: Prisma.SubscriptionWhereInput = {};
      if (input?.status === "ACTIVE") {
        where.status = "ACTIVE";
        where.expiresAt = { gt: now };
      } else if (input?.status === "EXPIRED") {
        where.OR = [
          { status: "EXPIRED" },
          { expiresAt: { lte: now }, status: "ACTIVE" },
        ];
      } else if (input?.status) {
        where.status = input.status;
      }
      if (search) {
        where.AND = [
          {
            OR: [
              { user: { name: { contains: search, mode: "insensitive" } } },
              { user: { email: { contains: search, mode: "insensitive" } } },
              {
                creator: {
                  displayName: { contains: search, mode: "insensitive" },
                },
              },
            ],
          },
        ];
      }
      const [rows, total] = await Promise.all([
        context.db.subscription.findMany({
          include: {
            creator: { select: { displayName: true } },
            user: { select: { email: true, name: true } },
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: page * operationsPageSize,
          take: operationsPageSize + 1,
          where,
        }),
        context.db.subscription.count({ where }),
      ]);
      return {
        hasMore: rows.length > operationsPageSize,
        items: rows.slice(0, operationsPageSize).map((row) => ({
          createdAt: row.createdAt.toISOString(),
          creatorId: row.creatorId,
          creatorName: row.creator.displayName,
          expiresAt: row.expiresAt.toISOString(),
          id: row.id,
          status: effectiveSubscriptionStatus(row, now),
          userEmail: row.user.email,
          userId: row.userId,
          userName: row.user.name,
        })),
        page,
        total,
      };
    }
  );
