import type { CreatorDTO } from "@privana/api/contracts/product";
import { Camera, MapPin } from "lucide-react";
import Image from "next/image";
import { CreatorActions } from "@/domains/creators/creator-actions";
import { ReportContent } from "@/domains/posts/report-content";
import { Avatar } from "@/shared/components/avatar";

export function CreatorProfileHeader({ creator }: { creator: CreatorDTO }) {
  return (
    <section>
      <div className="relative h-40 bg-muted sm:h-52">
        {creator.coverUrl ? (
          <Image
            alt={`Capa de ${creator.displayName}`}
            className="object-cover"
            fill
            preload
            sizes="(max-width: 1280px) 100vw, 640px"
            src={creator.coverUrl}
            unoptimized
          />
        ) : (
          <Camera
            aria-hidden="true"
            className="absolute top-5 right-5 size-10 text-muted-foreground/20"
          />
        )}
      </div>
      <div className="px-4 pb-5 sm:px-5">
        <div className="relative -mt-12 mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="rounded-full border-4 border-card">
            <Avatar
              name={creator.displayName}
              size={92}
              src={creator.avatarUrl}
            />
          </div>
          <div className="pb-1">
            <CreatorActions creator={creator} />
          </div>
        </div>
        <h1 className="font-bold text-xl tracking-tight">
          {creator.displayName}
        </h1>
        <p className="mt-0.5 text-muted-foreground text-sm">
          @{creator.handle}
          {creator.isDemo ? " · Demonstração" : ""}
        </p>
        {creator.bio ? (
          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6">
            {creator.bio}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-xs">
          <span>{creator.category}</span>
          {creator.location ? (
            <span className="flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3" />
              {creator.location}
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex items-center gap-5 text-xs">
          <p>
            <strong className="text-foreground tabular-nums">
              {creator.postCount}
            </strong>{" "}
            <span className="text-muted-foreground">publicações</span>
          </p>
          <p>
            <strong className="text-foreground tabular-nums">
              {creator.followerCount}
            </strong>{" "}
            <span className="text-muted-foreground">seguidores</span>
          </p>
        </div>
        <div className="mt-4">
          <ReportContent creatorId={creator.id} />
        </div>
      </div>
    </section>
  );
}
