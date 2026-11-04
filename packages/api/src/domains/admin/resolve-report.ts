import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { moderationProcedure } from "../../index";
export const resolveReport = moderationProcedure
  .input(
    z.object({ id: z.string(), status: z.enum(["RESOLVED", "DISMISSED"]) })
  )
  .handler(async ({ context, input }) => {
    await context.db.$transaction(async (tx) => {
      const report = await tx.report.findUnique({ where: { id: input.id } });
      if (!report) {
        throw new ORPCError("NOT_FOUND");
      }
      await tx.report.update({
        data: { resolvedAt: new Date(), status: input.status },
        where: { id: input.id },
      });
      await tx.auditEvent.create({
        data: {
          action: "REPORT_RESOLVED",
          actorId: context.viewer.id,
          metadata: { from: report.status, to: input.status },
          targetId: input.id,
        },
      });
    });
    return { success: true as const };
  });
