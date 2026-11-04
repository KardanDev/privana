import type {
  OperationsPageDTO,
  OperationsReportDTO,
} from "../../../contracts/platform";
import { moderationProcedure } from "../../../index";
import {
  operationsInput,
  operationsPageSize,
  reportStatusFilter,
} from "./query-shapes";
export const operationsReports = moderationProcedure
  .input(operationsInput.extend({ status: reportStatusFilter }).optional())
  .handler(
    async ({
      context,
      input,
    }): Promise<OperationsPageDTO<OperationsReportDTO>> => {
      const page = input?.page ?? 0;
      const search = input?.search;
      const where = {
        ...(input?.status ? { status: input.status } : {}),
        ...(search
          ? {
              OR: [
                { id: { contains: search, mode: "insensitive" as const } },
                { reason: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      };
      const [rows, total] = await Promise.all([
        context.db.report.findMany({
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: page * operationsPageSize,
          take: operationsPageSize + 1,
          where,
        }),
        context.db.report.count({ where }),
      ]);
      return {
        hasMore: rows.length > operationsPageSize,
        items: rows.slice(0, operationsPageSize).map((row) => ({
          ...row,
          createdAt: row.createdAt.toISOString(),
          resolvedAt: row.resolvedAt?.toISOString() ?? null,
        })),
        page,
        total,
      };
    }
  );
