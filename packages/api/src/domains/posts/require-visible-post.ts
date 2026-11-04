import { ORPCError } from "@orpc/server";
import type { Database } from "@privana/db";
import { publicPostWhere } from "../shared/query-shapes";
export async function requireVisiblePost(db: Database, id: string) {
  const post = await db.post.findFirst({ where: { id, ...publicPostWhere } });
  if (!post) {
    throw new ORPCError("NOT_FOUND");
  }
  return post;
}
