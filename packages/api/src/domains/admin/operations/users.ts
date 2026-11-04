import type {
  OperationsPageDTO,
  OperationsUserDTO,
} from "../../../contracts/platform";
import { moderationProcedure } from "../../../index";
import {
  operationsInput,
  operationsPageSize,
  userRoleFilter,
  userStatusFilter,
} from "./query-shapes";
export const operationsUsers = moderationProcedure
  .input(
    operationsInput
      .extend({ role: userRoleFilter, status: userStatusFilter })
      .optional()
  )
  .handler(
    async ({
      context,
      input,
    }): Promise<OperationsPageDTO<OperationsUserDTO>> => {
      const page = input?.page ?? 0;
      const search = input?.search;
      const where = {
        ...(input?.status ? { status: input.status } : {}),
        ...(input?.role ? { role: input.role } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      };
      const [rows, total] = await Promise.all([
        context.db.user.findMany({
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: {
            createdAt: true,
            creatorProfile: { select: { id: true } },
            email: true,
            emailVerified: true,
            id: true,
            name: true,
            role: true,
            status: true,
          },
          skip: page * operationsPageSize,
          take: operationsPageSize + 1,
          where,
        }),
        context.db.user.count({ where }),
      ]);
      return {
        hasMore: rows.length > operationsPageSize,
        items: rows.slice(0, operationsPageSize).map((row) => ({
          createdAt: row.createdAt.toISOString(),
          creatorId: row.creatorProfile?.id ?? null,
          email: row.email,
          emailVerified: row.emailVerified,
          id: row.id,
          name: row.name,
          role: row.role,
          status: row.status,
        })),
        page,
        total,
      };
    }
  );
