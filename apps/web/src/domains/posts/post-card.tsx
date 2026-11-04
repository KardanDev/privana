"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { useCallback, useState } from "react";
import { LockedPostPreview } from "@/domains/posts/locked-post-preview";
import { PostActions } from "@/domains/posts/post-actions";
import { PostAuthor } from "@/domains/posts/post-author";
import { PostBody } from "@/domains/posts/post-body";
import { PostComments } from "@/domains/posts/post-comments";
import { PostMedia } from "@/domains/posts/post-media";
import { ReportContent } from "@/domains/posts/report-content";

export function PostCard({ post }: { post: PostDTO }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const toggleComments = useCallback(
    () => setCommentsOpen((value) => !value),
    []
  );
  const openReport = useCallback(() => setReportOpen(true), []);
  return (
    <article className="min-w-0 border-b bg-card">
      <PostAuthor onReport={openReport} post={post} />
      <PostBody
        body={post.locked ? post.excerpt : (post.body ?? post.excerpt)}
        title={post.title}
      />
      <PostMedia
        locked={post.locked}
        mediaType={post.mediaType}
        mediaUrl={post.mediaUrl}
        previewUrl={post.previewUrl}
        title={post.title}
      />
      {post.locked ? <LockedPostPreview handle={post.creator.handle} /> : null}
      <PostActions
        commentsOpen={commentsOpen}
        onComments={toggleComments}
        post={post}
      />
      {commentsOpen && !post.locked ? (
        <div className="px-4 pb-4 sm:px-5">
          <PostComments postId={post.id} />
        </div>
      ) : null}
      {reportOpen ? (
        <div className="px-4 pb-4 sm:px-5">
          <ReportContent expanded postId={post.id} />
        </div>
      ) : null}
    </article>
  );
}
