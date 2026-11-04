"use client";

import { Button } from "@privana/ui/components/button";
import { Skeleton } from "@privana/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback } from "react";
import { CreatorSearch } from "@/domains/discovery/creator-search";
import { SuggestedCreator } from "@/domains/feed/suggested-creator";
import { client } from "@/utils/orpc";

export function CreatorSuggestions({
  showSearch = true,
}: {
  showSearch?: boolean;
}) {
  const creators = useQuery({
    queryFn: () => client.creators.list({ limit: 5 }),
    queryKey: ["creator-suggestions"],
  });
  const retry = useCallback(() => creators.refetch(), [creators]);
  return (
    <aside className="flex flex-col gap-6">
      {showSearch ? <CreatorSearch /> : null}
      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-semibold text-sm">Sugestões para você</h2>
          <Link
            className="text-primary text-xs hover:underline"
            href="/explore"
          >
            Ver todos
          </Link>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {creators.isPending
            ? ["first", "second", "third"].map((id) => (
                <div className="flex items-center gap-3" key={id}>
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))
            : null}
          {creators.data?.items.map((creator) => (
            <SuggestedCreator creator={creator} key={creator.id} />
          ))}
          {creators.data?.items.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Novos perfis aparecerão aqui quando estiverem disponíveis.
            </p>
          ) : null}
          {creators.isError ? (
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm">
                Sugestões indisponíveis no momento.
              </p>
              <Button onClick={retry} size="sm" variant="outline">
                Tentar novamente
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    </aside>
  );
}
