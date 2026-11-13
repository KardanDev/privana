"use client";

import {
  defaultPlatformConfig,
  type PlatformConfig,
} from "@privana/api/contracts/platform";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { orpc } from "@/utils/orpc";
import { PlatformContext } from "./platform-context";
import { usePublishedAccent } from "./use-published-accent";

export function PlatformProvider({
  children,
  initialConfig,
}: {
  children: ReactNode;
  initialConfig: PlatformConfig;
}) {
  const published = useQuery({
    ...orpc.platform.get.queryOptions(),
    initialData: initialConfig,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
  const config = published.data ?? defaultPlatformConfig;
  usePublishedAccent(config.brand.accentColor);
  return (
    <PlatformContext value={config}>
      <div className="min-h-svh">{children}</div>
    </PlatformContext>
  );
}
