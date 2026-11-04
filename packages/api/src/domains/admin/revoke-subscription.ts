import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { adminProcedure } from "../../index";
export const revokeSubscription = adminProcedure
  .input(
    z
      .object({
        id: z.string().min(1).max(200),
        reason: z.string().trim().min(10).max(1000),
      })
      .strict()
  )
  .handler(async ({ context, input }) => {
    await context.db.$transaction(async (tx) => {
      const subscription = await tx.subscription.findUnique({
        where: { id: input.id },
      });
      if (!subscription) {
        throw new ORPCError("NOT_FOUND");
      }
      if (subscription.status === "REVOKED") {
        return;
      }
      await tx.subscription.update({
        data: { status: "REVOKED" },
        where: { id: input.id },
      });
      await tx.auditEvent.create({
        data: {
          action: "LOCAL_SUBSCRIPTION_ACCESS_REVOKED",
          actorId: context.viewer.id,
          metadata: {
            billingChanged: false,
            from: subscription.status,
            reason: input.reason,
            to: "REVOKED",
          },
          targetId: subscription.id,
        },
      });
    });
    return { success: true as const };
  });
