import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../index";
import { publicCreatorWhere, publicPostWhere } from "../shared/query-shapes";
export const createReport = protectedProcedure
  .input(
    z
      .object({
        creatorId: z.string().optional(),
        postId: z.string().optional(),
        reason: z.string().trim().min(10).max(2000),
      })
      .refine(
        (value) => Boolean(value.postId) !== Boolean(value.creatorId),
        "Escolha uma publicação ou um perfil."
      )
  )
  .handler(async ({ context, input }) => {
    if (
      input.postId &&
      !(await context.db.post.findFirst({
        where: { id: input.postId, ...publicPostWhere },
      }))
    ) {
      throw new ORPCError("NOT_FOUND");
    }
    if (
      input.creatorId &&
      !(await context.db.creatorProfile.findFirst({
        where: { id: input.creatorId, ...publicCreatorWhere },
      }))
    ) {
      throw new ORPCError("NOT_FOUND");
    }
    const row = await context.db.report.create({
      data: { ...input, reporterId: context.viewer.id },
    });
    return { id: row.id };
  });
