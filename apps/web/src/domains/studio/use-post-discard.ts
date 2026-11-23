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
  const departure = useRef<{
    proceed: () => void;
    restoreFocus?: () => void;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const cancel = useCallback(() => {
    departure.current = null;
    setOpen(false);
  }, []);
  const keepEditing = useCallback(() => {
    const restoreFocus = departure.current?.restoreFocus;
    cancel();
    if (restoreFocus) {
      requestAnimationFrame(restoreFocus);
    }
  }, [cancel]);
  const discard = useCallback(() => {
    if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
      return;
    }
    const proceed = departure.current?.proceed;
    cancel();
    proceed?.();
  }, [cancel, queryClient]);
  const defer = useCallback(
    (proceed: () => void, restoreFocus?: () => void) => {
      if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
        return true;
      }
      if (
        ref.current &&
        hasUnsavedPostChanges(new FormData(ref.current), post)
      ) {
        departure.current = { proceed, restoreFocus };
        setOpen(true);
        return true;
      }
      cancel();
      return false;
    },
    [cancel, post, queryClient]
  );
  const request = useCallback(
    (proceed: () => void) => {
      if (!defer(proceed)) {
        proceed();
      }
    },
    [defer]
  );
  useImperativeHandle(leaveRef, () => ({ cancel, defer, request }), [
    cancel,
    defer,
    request,
  ]);
  const requestClose = useCallback(() => request(onClose), [onClose, request]);
  return { discard, keepEditing, open, ref, requestClose };
}
