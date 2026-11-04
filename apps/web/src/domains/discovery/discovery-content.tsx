"use client";

import type { CreatorDTO, PageDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@privana/ui/components/input-group";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useDeferredValue } from "react";
import { CreatorCard } from "@/domains/creators/creator-card";
import { FeaturedCreators } from "@/domains/discovery/featured-creators";
import { ContentSkeleton } from "@/domains/feed/components/content-skeleton";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { CreatorSuggestions } from "@/domains/feed/creator-suggestions";
import { SocialHeading } from "@/domains/feed/social-heading";
import { EmptyState } from "@/shared/components/empty-state";
import { usePlatform } from "@/shared/platform/use-platform";
import { client } from "@/utils/orpc";

export function DiscoveryContent() {
  const platform = usePlatform();
  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const deferredSearch = useDeferredValue(search);
  const creators = useInfiniteQuery({
    getNextPageParam: (page: PageDTO<CreatorDTO>) =>
      page.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      client.creators.list({
        category: category || undefined,
        cursor: pageParam,
        search: deferredSearch || undefined,
      }),
    queryKey: ["discovery", { category, search: deferredSearch }],
  });
  const items = creators.data?.pages.flatMap((page) => page.items) ?? [];
  const changeSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (event.target.value) {
        params.set("q", event.target.value);
      } else {
        params.delete("q");
      }
      window.history.replaceState(null, "", `/explore?${params.toString()}`);
    },
    [searchParams]
  );
  const selectCategory = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (event.currentTarget.value) {
        params.set("category", event.currentTarget.value);
      } else {
        params.delete("category");
      }
      window.history.replaceState(null, "", `/explore?${params.toString()}`);
    },
    [searchParams]
  );
  const retry = useCallback(() => creators.refetch(), [creators]);
  const loadMore = useCallback(() => creators.fetchNextPage(), [creators]);
  return (
    <div className="grid grid-cols-[minmax(0,640px)] items-start justify-center gap-6 xl:grid-cols-[minmax(0,640px)_280px]">
      <section className="min-w-0 border-x bg-card">
        <SocialHeading
          description={platform.discovery.description}
          title={platform.discovery.title}
        />
        <div className="flex flex-col gap-4 border-b px-4 py-4 sm:px-5">
          <label className="sr-only" htmlFor="creator-search">
            Buscar criadores
          </label>
          <InputGroup className="h-11 rounded-full bg-muted/60">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              autoComplete="off"
              id="creator-search"
              onChange={changeSearch}
              placeholder="Buscar por nome ou assunto"
              type="search"
              value={search}
            />
          </InputGroup>
          <fieldset
            aria-label="Categorias"
            className="flex min-w-0 gap-2 overflow-x-auto pb-1"
          >
            <Button
              aria-pressed={!category}
              className="rounded-full"
              onClick={selectCategory}
              size="sm"
              value=""
              variant={category ? "outline" : "default"}
            >
              Todos
            </Button>
            {platform.discovery.categories.map((item) => (
              <Button
                aria-pressed={category === item}
                className="rounded-full"
                key={item}
                onClick={selectCategory}
                size="sm"
                value={item}
                variant={category === item ? "default" : "outline"}
              >
                {item}
              </Button>
            ))}
          </fieldset>
        </div>
        {search || category ? null : <FeaturedCreators />}
        <div className="p-4 sm:p-5">
          {creators.isPending ? <ContentSkeleton /> : null}
          {creators.isError ? (
            <QueryFeedback error={creators.error} retry={retry} />
          ) : null}
          {creators.isSuccess && items.length === 0 ? (
            <EmptyState
              description={
                search || category
                  ? "Experimente outro nome ou categoria."
                  : "Os perfis aprovados aparecerão aqui."
              }
              icon={Users}
              title="Nenhum criador encontrado"
            >
              {platform.features.creatorApplications ? (
                <Button
                  nativeButton={false}
                  render={<Link href="/studio" />}
                  variant="outline"
                >
                  Criar meu perfil
                </Button>
              ) : null}
            </EmptyState>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((creator) => (
              <CreatorCard creator={creator} key={creator.id} />
            ))}
          </div>
          {creators.hasNextPage ? (
            <div className="mt-5 text-center">
              <Button
                disabled={creators.isFetchingNextPage}
                onClick={loadMore}
                variant="outline"
              >
                {creators.isFetchingNextPage ? "Carregando…" : "Carregar mais"}
              </Button>
            </div>
          ) : null}
        </div>
      </section>
      <div className="hidden py-5 xl:block">
        <CreatorSuggestions showSearch={false} />
      </div>
    </div>
  );
}
