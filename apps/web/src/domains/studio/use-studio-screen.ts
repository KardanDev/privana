"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useState,
} from "react";
import { client, orpc } from "@/utils/orpc";

export function useStudioScreen() {
  const [status, setStatus] = useState<
    "ACTIVE" | "PUBLISHED" | "DRAFT" | "ARCHIVED"
  >("ACTIVE");
  const changeStatus = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (
      value === "ACTIVE" ||
      value === "PUBLISHED" ||
      value === "DRAFT" ||
      value === "ARCHIVED"
    ) {
      setStatus(value);
    }
  }, []);
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
  const closeEditor = useCallback(() => setEditor(null), []);
  const openEditor = useCallback(() => {
    setStatus("ACTIVE");
    setTab("posts");
    setEditor("new");
  }, []);
  const selectTab = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget;
    if (value === "posts" || value === "profile") {
      setTab(value);
      setEditor(null);
    }
  }, []);
  const loadMore = useCallback(() => query.fetchNextPage(), [query]);
  return {
    changeStatus,
    closeEditor,
    editor,
    loadMore,
    openEditor,
    query,
    selectTab,
    setEditor,
    status,
    tab,
  };
}
