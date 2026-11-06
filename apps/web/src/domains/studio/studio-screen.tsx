"use client";
import { Button } from "@privana/ui/components/button";
import { cn } from "@privana/ui/lib/utils";
import { useIsMutating } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BellRing,
  FileText,
  Heart,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { PageHeading } from "@/shared/components/page-heading";
import { QueryFeedback } from "@/shared/components/query-feedback";
import { StatCard } from "@/shared/components/stat-card";
import { ProfileForm } from "./profile-form";
import { STUDIO_WRITE_KEY } from "./studio-cache-types";
import { StudioLoadMore } from "./studio-load-more";
import { StudioPosts } from "./studio-posts";
import { StudioStatusNotice } from "./studio-status-notice";
import { StudioWriteNotice } from "./studio-write-notice";
import { useStudioScreen } from "./use-studio-screen";
export function StudioScreen() {
  const state = useStudioScreen();
  const pending = useIsMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0;
  const { query, tab, editor } = state;
  if (query.isPending) {
    return <QueryFeedback loading />;
  }
  if (query.isError && !query.data) {
    return <QueryFeedback retry={query.refetch} />;
  }
  const overview = query.data?.pages[0];
  if (!overview) {
    return <QueryFeedback retry={query.refetch} />;
  }
  const { profile, metrics } = overview;
  const visiblePosts = query.data?.pages.flatMap((page) => page.posts) ?? [];
  return (
    <>
      <PageHeading
        description="Seu conteúdo e sua comunidade, de perto."
        title="Meu estúdio"
      >
        {profile?.status === "ACTIVE" && (
          <div className="flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={<Link href={`/creators/${profile.handle}`} />}
              variant="outline"
            >
              Ver perfil{" "}
              <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
            </Button>
            <Button disabled={pending} onClick={state.openEditor}>
              <Plus aria-hidden="true" data-icon="inline-start" />
              Nova publicação
            </Button>
          </div>
        )}
      </PageHeading>
      <StudioWriteNotice />
      {profile ? (
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-0 sm:gap-3 xl:grid-cols-4">
            <StatCard
              icon={Users}
              label="Seguidores"
              value={metrics.followers}
            />
            <StatCard
              icon={FileText}
              label="Publicações"
              value={metrics.posts}
            />
            <StatCard
              icon={BellRing}
              label="Interesse em assinar"
              value={metrics.interests}
            />
            <StatCard
              icon={Heart}
              label="Assinaturas ativas"
              value={metrics.activeSubscriptions}
            />
          </div>
          <StudioStatusNotice status={profile.status} />
          <fieldset
            aria-label="Seções do estúdio"
            className="flex flex-wrap gap-2 border-b pb-3"
          >
            {[
              { id: "posts", label: "Minhas publicações" },
              { id: "profile", label: "Editar perfil" },
            ].map((item) => (
              <Button
                aria-pressed={tab === item.id}
                className={cn(tab === item.id && "shadow-sm")}
                disabled={pending}
                key={item.id}
                onClick={state.selectTab}
                size="sm"
                value={item.id}
                variant={tab === item.id ? "secondary" : "ghost"}
              >
                {item.label}
              </Button>
            ))}
          </fieldset>
          {tab === "profile" ? (
            <ProfileForm profile={profile} />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold text-base">Seu conteúdo</h2>
                <label className="flex items-center gap-2 text-muted-foreground text-sm">
                  Mostrar
                  <select
                    className="h-10 rounded-lg border border-input bg-card px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={pending}
                    onChange={state.changeStatus}
                    value={state.status}
                  >
                    <option value="ACTIVE">Todas as ativas</option>
                    <option value="PUBLISHED">Publicadas</option>
                    <option value="DRAFT">Rascunhos</option>
                    <option value="ARCHIVED">Arquivadas</option>
                  </select>
                </label>
              </div>
              <StudioPosts
                active={profile.status === "ACTIVE"}
                editor={editor}
                filtered={state.status !== "ACTIVE"}
                onClose={state.closeEditor}
                onEdit={state.setEditor}
                onOpen={state.openEditor}
                posts={visiblePosts}
              />
              <StudioLoadMore
                error={query.isFetchNextPageError}
                hasMore={query.hasNextPage}
                onLoad={state.loadMore}
                pending={query.isFetching}
              />
            </>
          )}
        </div>
      ) : (
        <ProfileForm profile={null} />
      )}
    </>
  );
}
