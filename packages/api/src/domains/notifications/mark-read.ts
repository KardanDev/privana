import { z } from "zod";
import { protectedProcedure } from "../../index";
export const markRead = protectedProcedure
  .input(z.object({ id: z.string().optional() }))
  .handler(async ({ context, input }) => {
    await context.db.notification.updateMany({
      data: { readAt: new Date() },
      where: {
        userId: context.viewer.id,
        ...(input.id ? { id: input.id } : {}),
        readAt: null,
      },
    });
    return { success: true as const };
  });
