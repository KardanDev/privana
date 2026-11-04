import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { moderationProcedure } from "../../index";
import { lockCreatorModerationTarget } from "./lock-creator-moderation-target";
export const setCreatorStatus = moderationProcedure
  .input(z.object({ id: z.string(), status: z.enum(["ACTIVE", "SUSPENDED"]) }))
  .handler(async ({ context, input }) => {
    await context.db.$transaction(async (tx) => {
      const creator = await lockCreatorModerationTarget(tx, input.id);
      if (!creator) {
        throw new ORPCError("NOT_FOUND");
      }
      if (
        context.viewer.role === "moderator" &&
        !["member", "creator"].includes(creator.userRole)
      ) {
        throw new ORPCError("FORBIDDEN", {
          message:
            "Perfis da equipe são gerenciados por um superadministrador.",
        });
      }
      if (
        creator.userId === context.viewer.id &&
        input.status === "SUSPENDED"
      ) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Você não pode suspender seu próprio perfil.",
        });
      }
      await tx.creatorProfile.update({
        data: { status: input.status },
        where: { id: input.id },
      });
      const promoteCreator =
        input.status === "ACTIVE" && creator.userRole === "member";
      if (promoteCreator) {
        await tx.user.updateMany({
          data: { role: "creator" },
          where: { id: creator.userId, role: "member" },
        });
      }
      await tx.auditEvent.create({
        data: {
          action: "CREATOR_STATUS_CHANGED",
          actorId: context.viewer.id,
          metadata: {
            from: creator.status,
            to: input.status,
            userRoleFrom: creator.userRole,
            userRoleTo: promoteCreator ? "creator" : creator.userRole,
          },
          targetId: input.id,
        },
      });
    });
    return { success: true as const };
  });
