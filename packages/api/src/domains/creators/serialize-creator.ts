import type { Database } from "@privana/db";
import type { Prisma } from "@privana/db/client";
import type { CreatorDTO } from "../../contracts/product";
import type { creatorInclude } from "../shared/query-shapes";
export async function serializeCreator(
  db: Database,
  creator: Prisma.CreatorProfileGetPayload<{ include: typeof creatorInclude }>,
  viewerId?: string,
  following?: boolean
): Promise<CreatorDTO> {
  return {
    avatarUrl: creator.avatarUrl,
    bio: creator.bio,
    category: creator.category,
    coverUrl: creator.coverUrl,
    displayName: creator.displayName,
    followerCount: creator._count.followers,
    handle: creator.handle,
    id: creator.id,
    isDemo: creator.isDemo,
    isFollowing:
      following ??
      (viewerId
        ? Boolean(
            await db.follow.findUnique({
              where: {
                userId_creatorId: { creatorId: creator.id, userId: viewerId },
              },
            })
          )
        : false),
    location: creator.location,
    monthlyPriceCents: creator.monthlyPriceCents,
    postCount: creator._count.posts,
    status: creator.status,
    userId: creator.userId,
  };
}
