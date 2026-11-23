"use client";

import type { QueryClient } from "@tanstack/react-query";
import { useContext, useLayoutEffect } from "react";
import { NavigationGuardContext } from "@/shared/navigation/navigation-guard-context";
import type { PostLeaveRef } from "./post-leave-guard";
import { STUDIO_WRITE_KEY } from "./studio-cache-types";

export function useStudioLinkGuard(
  leaveRef: PostLeaveRef,
  queryClient: QueryClient
) {
  const guard = useContext(NavigationGuardContext)?.guard;
  useLayoutEffect(() => {
    if (!guard) {
      return;
    }
    guard.current = (destination, proceed, restoreFocus) => {
      const { pathname, search } = window.location;
      const editor = leaveRef.current;
      if (destination.pathname === pathname && destination.search === search) {
        if (destination.hash) {
          return false;
        }
        if (editor) {
          editor.cancel();
          return true;
        }
      }
      if (editor) {
        return editor.defer(proceed, restoreFocus);
      }
      return queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0;
    };
    return () => {
      guard.current = null;
    };
  }, [guard, leaveRef, queryClient]);
}
