"use client";

import type { CreatorDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus } from "lucide-react";
import { useCallback } from "react";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { orpc } from "@/utils/orpc";

export function FollowButton({
  creator,
  compact = false,
}: {
  creator: CreatorDTO;
  compact?: boolean;
}) {
  const queryClient = useQueryClient();
  const follow = useMutation(
    orpc.creators.setFollow.mutationOptions({
      onError: handleActionError,
      onSuccess: async () => {
        await queryClient.invalidateQueries();
      },
    })
  );
  const toggleFollow = useCallback(
    () =>
      follow.mutate({ creatorId: creator.id, following: !creator.isFollowing }),
    [follow, creator]
  );
  return (
    <Button
      aria-label={`${creator.isFollowing ? "Deixar de seguir" : "Seguir"} ${creator.displayName}`}
      aria-pressed={creator.isFollowing}
      disabled={follow.isPending}
      onClick={toggleFollow}
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
