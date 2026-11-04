import { z } from "zod";
import { protectedProcedure } from "../../index";
import { serializeCreator } from "../creators/serialize-creator";
import { serializePosts } from "../posts/serialize-posts";
import { creatorInclude, postInclude } from "../shared/query-shapes";

const pageSize = 24;

export const studioOverview = protectedProcedure
  .input(
    z
      .object({
        cursor: z.string().min(1).max(200).optional(),
        status: z
          .enum(["ACTIVE", "PUBLISHED", "DRAFT", "ARCHIVED"])
          .default("ACTIVE"),
      })
      .optional()
  )
  .handler(async ({ context, input }) => {
    const profile = await context.db.creatorProfile.findUnique({
      include: creatorInclude,
      where: { userId: context.viewer.id },
    });
    if (!profile) {
      return {
        metrics: {
          activeSubscriptions: 0,
          followers: 0,
          interests: 0,
          posts: 0,
        },
        nextCursor: null,
        posts: [],
        profile: null,
      };
    }
    const [rows, activeSubscriptions, interests, totalPosts] =
      await Promise.all([
        context.db.post.findMany({
          include: postInclude,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: pageSize + 1,
          where: {
            creatorId: profile.id,
            status:
              !input?.status || input.status === "ACTIVE"
                ? { not: "ARCHIVED" }
                : input.status,
          },
          ...(input?.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        }),
        context.db.subscription.count({
          where: {
            creatorId: profile.id,
            expiresAt: { gt: new Date() },
            status: "ACTIVE",
          },
        }),
        context.db.membershipInterest.count({
          where: { creatorId: profile.id },
        }),
        context.db.post.count({
          where: { creatorId: profile.id, status: { not: "ARCHIVED" } },
        }),
      ]);
    return {
      metrics: {
        activeSubscriptions,
        followers: profile._count.followers,
        interests,
        posts: totalPosts,
      },
      nextCursor:
        rows.length > pageSize ? (rows[pageSize - 1]?.id ?? null) : null,
      posts: await serializePosts(
        context.db,
        rows.slice(0, pageSize),
        context.viewer
      ),
      profile: await serializeCreator(context.db, profile, context.viewer.id),
    };
  });
