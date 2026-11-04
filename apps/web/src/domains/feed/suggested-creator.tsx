import type { CreatorDTO } from "@privana/api/contracts/product";
import Link from "next/link";
import { FollowButton } from "@/domains/creators/follow-button";
import { Avatar } from "@/shared/components/avatar";

export function SuggestedCreator({ creator }: { creator: CreatorDTO }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Link
        className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={`/creators/${creator.handle}`}
      >
        <Avatar name={creator.displayName} size={40} src={creator.avatarUrl} />
      </Link>
      <Link
        className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={`/creators/${creator.handle}`}
      >
        <p className="truncate font-semibold text-sm">{creator.displayName}</p>
        <p className="truncate text-muted-foreground text-xs">
          @{creator.handle}
        </p>
      </Link>
      <FollowButton compact creator={creator} />
    </div>
  );
}
