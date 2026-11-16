"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { hasUnsavedPostChanges } from "./has-unsaved-post-changes";
import { STUDIO_WRITE_KEY } from "./studio-cache-types";

export function usePostDiscard(post: PostDTO | undefined, onClose: () => void) {
  const ref = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const cancel = useCallback(() => setOpen(false), []);
  const discard = useCallback(() => {
    if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
      return;
    }
    setOpen(false);
    onClose();
  }, [onClose, queryClient]);
  const requestClose = useCallback(() => {
    if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
      return;
    }
    if (ref.current && hasUnsavedPostChanges(new FormData(ref.current), post)) {
      setOpen(true);
    } else {
      onClose();
    }
  }, [onClose, post, queryClient]);
  return { cancel, discard, open, ref, requestClose };
}
