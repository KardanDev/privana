"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { useQueryClient } from "@tanstack/react-query";
import { type RefObject, useLayoutEffect } from "react";
import { hasUnsavedPostChanges } from "./has-unsaved-post-changes";
import { STUDIO_WRITE_KEY } from "./studio-cache-types";

export function usePostBeforeUnload(
  formRef: RefObject<HTMLFormElement | null>,
  post?: PostDTO
) {
  const queryClient = useQueryClient();
  useLayoutEffect(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    let dirty = hasUnsavedPostChanges(new FormData(form), post);
    let listening = false;
    const hasPendingWrite = () =>
      queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = " ";
    };
    const syncProtection = () => {
      const needed = dirty || hasPendingWrite();
      if (needed === listening) {
        return;
      }
      listening = needed;
      if (needed) {
        window.addEventListener("beforeunload", warn);
      } else {
        window.removeEventListener("beforeunload", warn);
      }
    };
    const readChanges = () => {
      // Disabled fields are omitted from FormData during a write.
      if (!hasPendingWrite()) {
        dirty = hasUnsavedPostChanges(new FormData(form), post);
      }
      syncProtection();
    };

    const unsubscribe = queryClient
      .getMutationCache()
      .subscribe(syncProtection);
    form.addEventListener("input", readChanges, true);
    form.addEventListener("change", readChanges, true);
    form.addEventListener("submit", readChanges, true);
    syncProtection();
    return () => {
      unsubscribe();
      form.removeEventListener("input", readChanges, true);
      form.removeEventListener("change", readChanges, true);
      form.removeEventListener("submit", readChanges, true);
      window.removeEventListener("beforeunload", warn);
    };
  }, [formRef, post, queryClient]);
}
