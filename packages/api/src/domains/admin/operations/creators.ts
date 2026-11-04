import type {
  OperationsCreatorDTO,
  OperationsPageDTO,
} from "../../../contracts/platform";
import { moderationProcedure } from "../../../index";
import { serializeCreator } from "../../creators/serialize-creator";
import { creatorInclude } from "../../shared/query-shapes";
import {
  creatorStatusFilter,
  operationsInput,
  operationsPageSize,
} from "./query-shapes";
export const operationsCreators = moderationProcedure
  .input(operationsInput.extend({ status: creatorStatusFilter }).optional())
  .handler(
    async ({
      context,
      input,
    }): Promise<OperationsPageDTO<OperationsCreatorDTO>> => {
      const page = input?.page ?? 0;
      const search = input?.search;
      const where = {
        ...(input?.status ? { status: input.status } : {}),
        ...(search
          ? {
              OR: [
                {
                  displayName: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                { handle: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      };
      const [rows, total] = await Promise.all([
        context.db.creatorProfile.findMany({
          include: creatorInclude,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: page * operationsPageSize,
          take: operationsPageSize + 1,
          where,
        }),
        context.db.creatorProfile.count({ where }),
      ]);
      return {
        hasMore: rows.length > operationsPageSize,
        items: await Promise.all(
          rows
            .slice(0, operationsPageSize)
            .map((row) => serializeCreator(context.db, row))
        ),
        page,
        total,
      };
    }
  );
