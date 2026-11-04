import { ORPCError } from "@orpc/server";
import { protectedProcedure } from "../../index";
import { serializeCreator } from "../creators/serialize-creator";
import { requirePlatformFeature } from "../platform/require-feature";
import { creatorInclude, profileInput } from "../shared/query-shapes";
export const saveProfile = protectedProcedure
  .input(profileInput)
  .handler(async ({ context, input }) => {
    const existing = await context.db.creatorProfile.findUnique({
      where: { userId: context.viewer.id },
    });
    if (!existing) {
      await requirePlatformFeature(context.db, "creatorApplications");
    }
    if (existing?.status === "SUSPENDED") {
      throw new ORPCError("FORBIDDEN", {
        message: "Seu perfil está suspenso.",
      });
    }
    const conflict = await context.db.creatorProfile.findUnique({
      where: { handle: input.handle },
    });
    if (conflict && conflict.userId !== context.viewer.id) {
      throw new ORPCError("CONFLICT", {
        message: "Este identificador já está em uso.",
      });
    }
    const profile = await context.db.creatorProfile.upsert({
      create: { ...input, status: "PENDING", userId: context.viewer.id },
      include: creatorInclude,
      update: input,
      where: { userId: context.viewer.id },
    });
    return await serializeCreator(context.db, profile, context.viewer.id);
  });
