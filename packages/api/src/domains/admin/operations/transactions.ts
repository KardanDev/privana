import { z } from "zod";
import type {
  OperationsPageDTO,
  OperationsTransactionDTO,
} from "../../../contracts/platform";
import { financeProcedure } from "../../../index";
import {
  operationsInput,
  operationsPageSize,
  transactionStatusFilter,
} from "./query-shapes";
export const operationsTransactions = financeProcedure
  .input(
    operationsInput
      .extend({
        currency: z
          .string()
          .regex(/^[A-Z]{3}$/)
          .optional(),
        kind: z.enum(["CHARGE", "REFUND"]).optional(),
        status: transactionStatusFilter,
      })
      .optional()
  )
  .handler(
    async ({
      context,
      input,
    }): Promise<OperationsPageDTO<OperationsTransactionDTO>> => {
      const page = input?.page ?? 0;
      const search = input?.search;
      const where = {
        ...(input?.status ? { status: input.status } : {}),
        ...(input?.kind ? { kind: input.kind } : {}),
        ...(input?.currency ? { currency: input.currency } : {}),
        ...(search
          ? {
              OR: [
                {
                  externalId: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  provider: { contains: search, mode: "insensitive" as const },
                },
                {
                  user: {
                    name: { contains: search, mode: "insensitive" as const },
                  },
                },
                {
                  creator: {
                    displayName: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              ],
            }
          : {}),
      };
      const [rows, total] = await Promise.all([
        context.db.transactionRecord.findMany({
          include: {
            creator: { select: { displayName: true } },
            user: { select: { name: true } },
          },
          orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
          skip: page * operationsPageSize,
          take: operationsPageSize + 1,
          where,
        }),
        context.db.transactionRecord.count({ where }),
      ]);
      return {
        hasMore: rows.length > operationsPageSize,
        items: rows.slice(0, operationsPageSize).map((row) => ({
          amountMinor: row.amountMinor,
          createdAt: row.createdAt.toISOString(),
          creatorId: row.creatorId,
          creatorName: row.creator?.displayName ?? null,
          currency: row.currency,
          externalId: row.externalId,
          id: row.id,
          kind: row.kind,
          occurredAt: row.occurredAt.toISOString(),
          provider: row.provider,
          status: row.status,
          subscriptionId: row.subscriptionId,
          userId: row.userId,
          userName: row.user?.name ?? null,
        })),
        page,
        total,
      };
    }
  );
