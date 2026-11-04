import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { moderationProcedure } from "../../index";
export const setUserStatus = moderationProcedure
  .input(z.object({ id: z.string(), status: z.enum(["ACTIVE", "SUSPENDED"]) }))
  .handler(async ({ context, input }) => {
    if (input.id === context.viewer.id) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Você não pode alterar o estado da sua própria conta.",
      });
    }
    await context.db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: input.id } });
      if (!user) {
        throw new ORPCError("NOT_FOUND");
      }
      if (
        user.role === "admin" ||
        (context.viewer.role === "moderator" &&
          !["member", "creator"].includes(user.role))
      ) {
        throw new ORPCError("FORBIDDEN", {
          message: "Administradores são gerenciados pelo operador do banco.",
        });
      }
      const changed = await tx.user.updateMany({
        data: { status: input.status },
        where: { id: input.id, role: user.role, status: user.status },
      });
      if (changed.count !== 1) {
        throw new ORPCError("CONFLICT", {
          message:
            "A conta mudou durante a operação. Recarregue e tente novamente.",
        });
      }
      if (input.status === "SUSPENDED") {
        await tx.session.deleteMany({ where: { userId: input.id } });
      }
      await tx.auditEvent.create({
        data: {
          action: "USER_STATUS_CHANGED",
          actorId: context.viewer.id,
          metadata: { from: user.status, to: input.status },
          targetId: input.id,
        },
      });
    });
    return { success: true as const };
  });
