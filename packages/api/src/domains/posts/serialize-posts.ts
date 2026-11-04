import type { Database } from "@privana/db";
import type { PostDTO } from "../../contracts/product";
import type { AccessUser } from "../access/can-access-post";
import type { PostSerializationRecord } from "./load-post-serialization-state";
import { loadPostSerializationState } from "./load-post-serialization-state";
import { serializePost } from "./serialize-post";

export async function serializePosts(
  db: Database,
  posts: PostSerializationRecord[],
  viewer: AccessUser | null
): Promise<PostDTO[]> {
  const state = await loadPostSerializationState(db, posts, viewer);
  return await Promise.all(
    posts.map((post) => serializePost(db, post, viewer, state.get(post.id)))
  );
}
