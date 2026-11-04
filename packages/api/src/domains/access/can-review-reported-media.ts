import type { Database } from "@privana/db";
import type { AccessUser } from "./can-access-post";

export async function canReviewReportedMedia(
  db: Database,
  postId: string,
  viewer: AccessUser | null
): Promise<boolean> {
  if (viewer?.status !== "ACTIVE" || viewer.role !== "moderator") {
    return false;
  }
  const report = await db.report.findFirst({
    select: { id: true },
    where: { postId },
  });
  return Boolean(report);
}
