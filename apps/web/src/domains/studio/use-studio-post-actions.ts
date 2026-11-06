"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";
import { archiveStudioCache } from "./archive-studio-cache";
import { invalidateStudioContent } from "./invalidate-studio-content";
import { rollbackStudioArchive } from "./rollback-studio-archive";
import {
  STUDIO_WRITE_KEY,
  type StudioCacheSnapshot,
} from "./studio-cache-types";

export function useStudioPostActions(
  post: PostDTO,
  onEdit: (post: PostDTO) => void
) {
  const [confirm, setConfirm] = useState(false);
  const queryClient = useQueryClient();
  const writes = useIsMutating({ mutationKey: STUDIO_WRITE_KEY });
  const { isPending, mutate } = useMutation(
    orpc.studio.deletePost.mutationOptions({
      mutationKey: [...STUDIO_WRITE_KEY, "archive", post.id],
      onError: (_error, _variables, snapshots) => {
        rollbackStudioArchive(queryClient, snapshots ?? [], post);
        toast.error("Não foi possível arquivar. A publicação foi restaurada.");
      },
      onMutate: async (): Promise<StudioCacheSnapshot[]> => {
        await queryClient.cancelQueries({
          queryKey: orpc.studio.overview.key(),
        });
        return archiveStudioCache(
          queryClient,
          orpc.studio.overview.key(),
          post
        );
      },
      onSettled: () =>
        invalidateStudioContent(
          queryClient,
          orpc.studio.overview.key(),
          post.creator.id
        ),
      onSuccess: () => {
        toast.success("Publicação arquivada.");
      },
      retry: false,
    })
  );
  const edit = useCallback(() => onEdit(post), [onEdit, post]);
  const cancelArchive = useCallback(() => setConfirm(false), []);
  const archive = useCallback(() => {
    if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
      return;
    }
    if (confirm) {
      mutate({ id: post.id });
    } else {
      setConfirm(true);
    }
  }, [confirm, mutate, post.id, queryClient]);
  return {
    archive,
    cancelArchive,
    confirm,
    edit,
    pending: isPending || writes > 0,
  };
}
