"use client";

import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { beginSocialPatch } from "./begin-social-patch";
import { reconcileSocialQueries } from "./reconcile-social-queries";
import { sendSocialToggle } from "./send-social-toggle";
import {
  SOCIAL_MUTATION_KEY,
  type SocialSnapshot,
  type SocialTogglePatch,
} from "./social-patch";
import { undoSocialPatch } from "./undo-social-patch";

export function useSocialToggle(patch: SocialTogglePatch) {
  const { kind } = patch;
  const id = patch.kind === "follow" ? patch.creatorId : patch.postId;
  const client = useQueryClient();
  const mutationKey = [...SOCIAL_MUTATION_KEY, kind, id];
  const pending = useIsMutating({ mutationKey }) > 0;
  const mutation = useMutation<
    unknown,
    Error,
    SocialTogglePatch,
    SocialSnapshot
  >({
    mutationFn: sendSocialToggle,
    mutationKey,
    onError: (error, value, snapshot) => {
      undoSocialPatch(client, snapshot, value);
      handleActionError(error);
    },
    onMutate: (value) => beginSocialPatch(client, value),
    onSettled: async () => {
      await reconcileSocialQueries(client);
    },
    retry: false,
  });
  const run = useCallback(() => {
    if (
      client.isMutating({ mutationKey: [...SOCIAL_MUTATION_KEY, kind, id] })
    ) {
      return;
    }
    mutation.mutate(patch);
  }, [client, id, kind, mutation, patch]);
  return { pending, run };
}
