"use client";

import { useQueries } from "@tanstack/react-query";
import Link from "next/link";
import { Avatar } from "@/shared/components/avatar";
import { usePlatform } from "@/shared/platform/use-platform";
import { client } from "@/utils/orpc";

export function FeaturedCreators() {
  const platform = usePlatform();
  const queries = useQueries({
    queries: platform.discovery.featuredHandles.map((handle) => ({
      queryFn: () => client.creators.get({ handle }),
      queryKey: ["creator", handle],
      retry: false,
    })),
  });
  const profiles = queries.flatMap((query) => (query.data ? [query.data] : []));
  if (profiles.length === 0) {
    return null;
  }
  return (
    <section className="border-b px-4 py-5 sm:px-5">
      <h2 className="mb-4 font-semibold text-sm">Em destaque</h2>
      <div className="flex gap-5 overflow-x-auto pb-1">
        {profiles.map((creator) => (
          <Link
            className="flex w-20 shrink-0 flex-col items-center gap-2 rounded-lg text-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={`/creators/${creator.handle}`}
            key={creator.id}
          >
            <Avatar
              name={creator.displayName}
              size={64}
              src={creator.avatarUrl}
            />
            <span className="w-full truncate font-medium text-xs">
              {creator.displayName}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
