"use client";

import type { CreatorDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { FollowButton } from "@/domains/creators/follow-button";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { usePlatform } from "@/shared/platform/use-platform";
import { orpc } from "@/utils/orpc";

export function CreatorActions({ creator }: { creator: CreatorDTO }) {
  const router = useRouter();
  const platform = usePlatform();
  const message = useMutation(
    orpc.messages.start.mutationOptions({
      onError: handleActionError,
      onSuccess: (conversation) => {
        router.push(
          `/messages?conversation=${encodeURIComponent(conversation.id)}`
        );
      },
    })
  );
  const startConversation = useCallback(
    () => message.mutate({ userId: creator.userId }),
    [message, creator]
  );
  return (
    <div className="flex flex-wrap gap-2">
      <FollowButton creator={creator} />
      {platform.features.messaging ? (
        <Button
          disabled={message.isPending}
          onClick={startConversation}
          variant="outline"
        >
          <MessageCircle data-icon="inline-start" />
          Mensagem
        </Button>
      ) : null}
    </div>
  );
}
