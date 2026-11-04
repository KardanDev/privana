import type { CmsRevisionDTO } from "../../../contracts/platform";
import { cmsProcedure } from "../../../index";
export const cmsHistory = cmsProcedure.handler(
  async ({ context }): Promise<CmsRevisionDTO[]> => {
    const revisions = await context.db.platformRevision.findMany({
      include: { publisher: { select: { name: true } } },
      orderBy: { version: "desc" },
      take: 30,
    });
    return revisions.map((revision) => ({
      id: revision.id,
      publishedAt: revision.publishedAt.toISOString(),
      publisherId: revision.publisherId,
      publisherName: revision.publisher.name,
      version: revision.version,
    }));
  }
);
