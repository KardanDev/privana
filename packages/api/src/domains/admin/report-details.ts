import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { moderationProcedure } from "../../index";
import { reportCreatorSelect } from "./report-creator-select";

export const reportDetails = moderationProcedure
  .input(z.object({ id: z.string().min(1).max(200) }))
  .handler(async ({ context, input }) => {
    const report = await context.db.report.findUnique({
      select: {
        createdAt: true,
        creator: { select: reportCreatorSelect },
        id: true,
        post: {
          select: {
            body: true,
            createdAt: true,
            creator: { select: reportCreatorSelect },
            excerpt: true,
            id: true,
            mediaKey: true,
            mediaType: true,
            status: true,
            title: true,
            visibility: true,
          },
        },
        reason: true,
        reporterId: true,
        resolvedAt: true,
        status: true,
      },
      where: { id: input.id },
    });
    if (!report) {
      throw new ORPCError("NOT_FOUND", { message: "Denúncia não encontrada." });
    }
    const { post } = report;
    return {
      createdAt: report.createdAt.toISOString(),
      creator: report.creator ?? post?.creator ?? null,
      id: report.id,
      post: post
        ? {
            body: post.body,
            createdAt: post.createdAt.toISOString(),
            excerpt: post.excerpt,
            id: post.id,
            mediaType: post.mediaType,
            mediaUrl: post.mediaKey ? `/api/media/${post.id}` : null,
            status: post.status,
            title: post.title,
            visibility: post.visibility,
          }
        : null,
      reason: report.reason,
      reporterId: report.reporterId,
      resolvedAt: report.resolvedAt?.toISOString() ?? null,
      status: report.status,
    };
  });
