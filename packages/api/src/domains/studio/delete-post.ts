import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../index";
import { requireOwner } from "../access/require-owner";
export const deletePost = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ context, input }) => {
    const row = await context.db.post.findUnique({
      include: { creator: true },
      where: { id: input.id },
    });
    if (!row) {
      throw new ORPCError("NOT_FOUND");
    }
    requireOwner(context.viewer.id, row.creator.userId);
    if (row.creator.status !== "ACTIVE") {
      throw new ORPCError("FORBIDDEN");
    }
    await context.db.post.update({
      data: { status: "ARCHIVED" },
      where: { id: row.id },
    });
    return { success: true as const };
  });
