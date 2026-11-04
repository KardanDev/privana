import type {
  OperationsAuditDTO,
  OperationsPageDTO,
} from "../../../contracts/platform";
import { adminProcedure } from "../../../index";
import { operationsInput, operationsPageSize } from "./query-shapes";
export const operationsAudits = adminProcedure
  .input(operationsInput.optional())
  .handler(
    async ({
      context,
      input,
    }): Promise<OperationsPageDTO<OperationsAuditDTO>> => {
      const page = input?.page ?? 0;
      const search = input?.search;
      const where = search
        ? {
            OR: [
              { action: { contains: search, mode: "insensitive" as const } },
              { targetId: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {};
      const [rows, total] = await Promise.all([
        context.db.auditEvent.findMany({
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: {
            action: true,
            actor: { select: { name: true } },
            actorId: true,
            createdAt: true,
            id: true,
            targetId: true,
          },
          skip: page * operationsPageSize,
          take: operationsPageSize + 1,
          where,
        }),
        context.db.auditEvent.count({ where }),
      ]);
      return {
        hasMore: rows.length > operationsPageSize,
        items: rows.slice(0, operationsPageSize).map((row) => ({
          action: row.action,
          actorId: row.actorId,
          actorName: row.actor.name,
          createdAt: row.createdAt.toISOString(),
          id: row.id,
          targetId: row.targetId,
        })),
        page,
        total,
      };
    }
  );
