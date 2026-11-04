import { ORPCError } from "@orpc/server";
import { protectedProcedure } from "../../index";
import { requireOwner } from "../access/require-owner";
import { postInput } from "../shared/query-shapes";
export const savePost = protectedProcedure
  .input(postInput)
  .handler(async ({ context, input }) => {
    const creator = await context.db.creatorProfile.findUnique({
      where: { userId: context.viewer.id },
    });
    if (creator?.status !== "ACTIVE") {
      throw new ORPCError("FORBIDDEN", {
        message: "A publicação requer um perfil aprovado e ativo.",
      });
    }
    const { id, ...data } = input;
    if (data.mediaKey) {
      const asset = await context.db.mediaAsset.findUnique({
        where: { key: data.mediaKey },
      });
      if (
        !data.mediaKey.startsWith(`${context.viewer.id}/`) ||
        data.mediaKey.includes("..") ||
        asset?.userId !== context.viewer.id ||
        asset.mimeType !== data.mediaType
      ) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Envie e confirme o arquivo antes de publicar.",
        });
      }
    } else if (data.mediaType && !data.mediaKey) {
      throw new ORPCError("BAD_REQUEST", {
        message: "O arquivo da mídia é obrigatório.",
      });
    }
    if (id) {
      const post = await context.db.post.findUnique({
        include: { creator: { select: { userId: true } } },
        where: { id },
      });
      if (!post) {
        throw new ORPCError("NOT_FOUND");
      }
      requireOwner(context.viewer.id, post.creator.userId);
      await context.db.post.update({ data, where: { id } });
      return { id };
    }
    const post = await context.db.post.create({
      data: { ...data, creatorId: creator.id },
    });
    return { id: post.id };
  });
