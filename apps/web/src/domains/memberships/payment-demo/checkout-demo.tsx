"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { PostStreamSkeleton } from "@/domains/feed/post-stream-skeleton";
import { client } from "@/utils/orpc";
import { CheckoutFlow } from "./checkout-flow";
import type { DemoCreator } from "./demo-types";

const SAMPLE_CREATOR: DemoCreator = {
  avatarUrl: null,
  handle: "demo",
  name: "Criador de exemplo",
  priceCents: 3900,
  sample: true,
};

export function CheckoutDemo({ handle }: { handle: string }) {
  const sample = handle === "demo";
  const creator = useQuery({
    enabled: !sample,
    queryFn: () => client.creators.get({ handle }),
    queryKey: ["creator", handle],
  });
  const retry = useCallback(() => creator.refetch(), [creator]);
  if (sample) {
    return <CheckoutFlow creator={SAMPLE_CREATOR} />;
  }
  if (creator.isPending) {
    return <PostStreamSkeleton />;
  }
  if (creator.isError) {
    return <QueryFeedback error={creator.error} retry={retry} />;
  }
  return (
    <CheckoutFlow
      creator={{
        avatarUrl: creator.data.avatarUrl,
        handle: creator.data.handle,
        name: creator.data.displayName,
        priceCents: creator.data.monthlyPriceCents,
        sample: false,
      }}
    />
  );
}
