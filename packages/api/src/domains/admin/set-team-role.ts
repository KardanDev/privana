import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { adminProcedure } from "../../index";
export const setTeamRole = adminProcedure
  .input(
    z
      .object({
        id: z.string().min(1).max(200),
        role: z.enum(["member", "editor", "moderator", "analyst"]),
      })
      .strict()
  )
  .handler(async ({ context, input }) => {
    if (input.id === context.viewer.id) {
      throw new ORPCError("FORBIDDEN", {
        message: "Você não pode alterar sua própria função.",
      });
    }
    await context.db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: input.id } });
      if (!user) {
        throw new ORPCError("NOT_FOUND");
      }
      if (
        user.role === "admin" ||
        user.status !== "ACTIVE" ||
        !user.emailVerified
      ) {
        throw new ORPCError("FORBIDDEN", {
          message:
            "Escolha uma conta ativa e verificada que não seja de um superadministrador.",
        });
      }
      const changed = await tx.user.updateMany({
        data: { role: input.role },
        where: {
          emailVerified: true,
          id: user.id,
          role: user.role,
          status: "ACTIVE",
        },
      });
      if (changed.count !== 1) {
        throw new ORPCError("CONFLICT", {
          message:
            "A conta mudou durante a operação. Recarregue e tente novamente.",
        });
      }
      await tx.session.deleteMany({ where: { userId: user.id } });
      await tx.auditEvent.create({
        data: {
          action: "TEAM_ROLE_CHANGED",
          actorId: context.viewer.id,
          metadata: { from: user.role, to: input.role },
          targetId: user.id,
        },
      });
    });
    return { success: true as const };
  });
