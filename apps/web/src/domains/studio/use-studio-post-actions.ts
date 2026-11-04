"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

export function useStudioPostActions(
  post: PostDTO,
  onEdit: (post: PostDTO) => void
) {
  const [confirm, setConfirm] = useState(false);
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation(
    orpc.studio.deletePost.mutationOptions({
      onError: () => toast.error("Não foi possível arquivar a publicação."),
      onSuccess: async () => {
        await queryClient.invalidateQueries();
        toast.success("Publicação arquivada.");
      },
    })
  );
  const edit = useCallback(() => onEdit(post), [onEdit, post]);
  const cancelArchive = useCallback(() => setConfirm(false), []);
  const archive = useCallback(() => {
    if (confirm) {
      mutate({ id: post.id });
    } else {
      setConfirm(true);
    }
  }, [confirm, mutate, post.id]);
  return { archive, cancelArchive, confirm, edit, pending: isPending };
}
