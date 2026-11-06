"use client";

import type { CreatorDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Check, Plus } from "lucide-react";
import { useSocialToggle } from "@/shared/query/use-social-toggle";

export function FollowButton({
  creator,
  compact = false,
}: {
  creator: CreatorDTO;
  compact?: boolean;
}) {
  const follow = useSocialToggle({
    creatorId: creator.id,
    following: !creator.isFollowing,
    kind: "follow",
  });
  return (
    <Button
      aria-busy={follow.pending}
      aria-label={`${creator.isFollowing ? "Deixar de seguir" : "Seguir"} ${creator.displayName}`}
      aria-pressed={creator.isFollowing}
      disabled={follow.pending}
      onClick={follow.run}
      size={compact ? "sm" : "default"}
      variant={creator.isFollowing ? "outline" : "default"}
    >
      {creator.isFollowing ? (
        <Check data-icon="inline-start" />
      ) : (
        <Plus data-icon="inline-start" />
      )}
      {creator.isFollowing ? "Seguindo" : "Seguir"}
    </Button>
  );
}
