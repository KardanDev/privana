"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useImperativeHandle, useRef, useState } from "react";
import { hasUnsavedPostChanges } from "./has-unsaved-post-changes";
import type { PostLeaveRef } from "./post-leave-guard";
import { STUDIO_WRITE_KEY } from "./studio-cache-types";

export function usePostDiscard(
  post: PostDTO | undefined,
  onClose: () => void,
  leaveRef?: PostLeaveRef
) {
  const ref = useRef<HTMLFormElement>(null);
  const destination = useRef<(() => void) | null>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const cancel = useCallback(() => {
    destination.current = null;
    setOpen(false);
  }, []);
  const discard = useCallback(() => {
    if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
      return;
    }
    const proceed = destination.current;
    cancel();
    proceed?.();
  }, [cancel, queryClient]);
  const request = useCallback(
    (proceed: () => void) => {
      if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
        return;
      }
      if (
        ref.current &&
        hasUnsavedPostChanges(new FormData(ref.current), post)
      ) {
        destination.current = proceed;
        setOpen(true);
      } else {
        cancel();
        proceed();
      }
    },
    [cancel, post, queryClient]
  );
  useImperativeHandle(leaveRef, () => ({ cancel, request }), [cancel, request]);
  const requestClose = useCallback(() => request(onClose), [onClose, request]);
  return { cancel, discard, open, ref, requestClose };
}
