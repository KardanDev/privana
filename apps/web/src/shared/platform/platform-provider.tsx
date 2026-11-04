"use client";

import {
  defaultPlatformConfig,
  type PlatformConfig,
} from "@privana/api/contracts/platform";
import { useQuery } from "@tanstack/react-query";
import type { CSSProperties, ReactNode } from "react";
import { orpc } from "@/utils/orpc";
import { PlatformContext } from "./platform-context";

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
  const colors = {
    "--brand-accent": config.brand.accentColor,
  } as CSSProperties;
  return (
    <PlatformContext value={config}>
      <div className="min-h-svh" data-platform-theme style={colors}>
        {children}
      </div>
    </PlatformContext>
  );
}
