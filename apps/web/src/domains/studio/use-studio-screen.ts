"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { client, orpc } from "@/utils/orpc";
import type { PostLeaveGuard } from "./post-leave-guard";
import { STUDIO_WRITE_KEY } from "./studio-cache-types";

export function useStudioScreen() {
  const leaveRef = useRef<PostLeaveGuard | null>(null);
  const filterRef = useRef<HTMLSelectElement>(null);
  const navigationRef = useRef<HTMLFieldSetElement>(null);
  const restoreFilterFocus = useRef(false);
  const queryClient = useQueryClient();
  const changeContext = useCallback(
    (same: boolean, proceed: () => void, restoreFocus = true) => {
      if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
        return;
      }
      if (same) {
        leaveRef.current?.cancel();
        return;
      }
      const trigger = document.activeElement;
      const navigate = () => {
        proceed();
        if (!restoreFocus) {
          return;
        }
        requestAnimationFrame(() => {
          const target =
            trigger instanceof HTMLElement &&
            trigger !== document.body &&
            trigger.isConnected
              ? trigger
              : navigationRef.current;
          target?.focus({ preventScroll: true });
        });
      };
      if (leaveRef.current) {
        leaveRef.current.request(navigate);
      } else {
        navigate();
      }
    },
    [queryClient]
  );
  const [status, setStatus] = useState<
    "ACTIVE" | "PUBLISHED" | "DRAFT" | "ARCHIVED"
  >("ACTIVE");
  const changeStatus = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      if (
        value === "ACTIVE" ||
        value === "PUBLISHED" ||
        value === "DRAFT" ||
        value === "ARCHIVED"
      ) {
        changeContext(
          value === status,
          () => {
            restoreFilterFocus.current = true;
            setStatus(value);
            setEditor(null);
          },
          false
        );
      }
    },
    [changeContext, status]
  );
  const query = useInfiniteQuery({
    getNextPageParam: (
      page: Awaited<ReturnType<typeof client.studio.overview>>
    ) => page.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      client.studio.overview({ cursor: pageParam, status }),
    queryKey: [...orpc.studio.overview.key(), { status }],
  });
  const [tab, setTab] = useState<"posts" | "profile">("posts");
  const [editor, setEditor] = useState<PostDTO | "new" | null>(null);
  useEffect(() => {
    if (
      query.data &&
      !query.isPending &&
      restoreFilterFocus.current &&
      filterRef.current
    ) {
      filterRef.current.focus({ preventScroll: true });
      restoreFilterFocus.current = false;
    }
  }, [query.isPending, query.data]);
  const closeEditor = useCallback(() => setEditor(null), []);
  const openEditor = useCallback(() => {
    changeContext(
      editor === "new" && tab === "posts" && status === "ACTIVE",
      () => {
        setStatus("ACTIVE");
        setTab("posts");
        setEditor("new");
      }
    );
  }, [changeContext, editor, status, tab]);
  const selectEditor = useCallback(
    (post: PostDTO) => {
      changeContext(editor !== "new" && editor?.id === post.id, () =>
        setEditor(post)
      );
    },
    [changeContext, editor]
  );
  const selectTab = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { value } = event.currentTarget;
      if (value === "posts" || value === "profile") {
        changeContext(value === tab, () => {
          setTab(value);
          setEditor(null);
        });
      }
    },
    [changeContext, tab]
  );
  const loadMore = useCallback(() => query.fetchNextPage(), [query]);
  return {
    changeStatus,
    closeEditor,
    editor,
    filterRef,
    leaveRef,
    loadMore,
    navigationRef,
    openEditor,
    query,
    selectEditor,
    selectTab,
    status,
    tab,
  };
}
