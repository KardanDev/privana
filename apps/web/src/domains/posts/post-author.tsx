import type { PostDTO } from "@privana/api/contracts/product";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { PostOverflowMenu } from "@/domains/posts/post-overflow-menu";
import { Avatar } from "@/shared/components/avatar";
import { formatDate } from "@/shared/formatting/format-date";

export function PostAuthor({
  post,
  onReport,
}: {
  post: PostDTO;
  onReport: () => void;
}) {
  return (
    <header className="flex items-center gap-3 px-4 pt-4 pb-3 sm:px-5">
      <Link
        className="flex min-w-0 flex-1 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={`/creators/${post.creator.handle}`}
      >
        <Avatar
          name={post.creator.displayName}
          size={42}
          src={post.creator.avatarUrl}
        />
        <div className="min-w-0">
          <p className="truncate font-semibold text-sm">
            {post.creator.displayName}
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-muted-foreground text-xs">
            <span className="truncate">@{post.creator.handle}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </p>
        </div>
      </Link>
      {post.visibility === "SUBSCRIBERS" ? (
        <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
          <LockKeyhole aria-hidden="true" className="size-3" />
          Exclusivo
        </span>
      ) : null}
      <PostOverflowMenu onReport={onReport} />
    </header>
  );
}
