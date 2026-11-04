import type { CreatorDTO } from "@privana/api/contracts/product";
import { Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "@/domains/creators/follow-button";
import { Avatar } from "@/shared/components/avatar";

export function CreatorCard({ creator }: { creator: CreatorDTO }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-lg border bg-card">
      <Link
        className="relative block aspect-[2.5/1] bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={`/creators/${creator.handle}`}
      >
        {creator.coverUrl ? (
          <Image
            alt={`Capa de ${creator.displayName}`}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            src={creator.coverUrl}
            unoptimized
          />
        ) : (
          <Camera
            aria-hidden="true"
            className="absolute top-4 right-4 size-6 text-muted-foreground/30"
          />
        )}
        {creator.isDemo ? (
          <span className="absolute top-2 right-2 rounded bg-background/95 px-2 py-1 text-[10px]">
            Demonstração
          </span>
        ) : null}
      </Link>
      <div className="px-4 pb-4">
        <div className="relative -mt-6 mb-3 flex items-end justify-between gap-2">
          <Link
            className="rounded-full border-4 border-card"
            href={`/creators/${creator.handle}`}
          >
            <Avatar
              name={creator.displayName}
              size={52}
              src={creator.avatarUrl}
            />
          </Link>
          <FollowButton compact creator={creator} />
        </div>
        <Link
          className="block min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={`/creators/${creator.handle}`}
        >
          <h2 className="truncate font-semibold text-sm">
            {creator.displayName}
          </h2>
          <p className="mt-0.5 truncate text-muted-foreground text-xs">
            @{creator.handle}
          </p>
        </Link>
        <p className="mt-3 line-clamp-2 min-h-10 text-muted-foreground text-xs leading-5">
          {creator.bio}
        </p>
        <p className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="truncate">{creator.category}</span>
          <span aria-hidden="true">·</span>
          <span className="shrink-0">{creator.postCount} publicações</span>
        </p>
      </div>
    </article>
  );
}
