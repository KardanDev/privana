"use client";

import { Button } from "@privana/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { ContentSkeleton } from "@/domains/feed/components/content-skeleton";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { SocialHeading } from "@/domains/feed/social-heading";
import { membershipStatusLabel } from "@/domains/memberships/membership-status-label";
import { Avatar } from "@/shared/components/avatar";
import { EmptyState } from "@/shared/components/empty-state";
import { formatDate } from "@/shared/formatting/format-date";
import { usePlatform } from "@/shared/platform/use-platform";
import { client } from "@/utils/orpc";
export function MembershipsPage() {
  const platform = usePlatform();
  const memberships = useQuery({
    queryFn: () => client.memberships.list(),
    queryKey: ["memberships"],
  });
  const retryMemberships = useCallback(
    () => memberships.refetch(),
    [memberships]
  );
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <SocialHeading title={platform.navigation.memberships} />
      <div className="rounded-lg border bg-card p-4">
        <p className="font-medium text-primary">Assinaturas em breve</p>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          As assinaturas ainda não estão disponíveis. Você pode registrar
          interesse no perfil dos seus criadores favoritos, sem cobrança.
        </p>
      </div>
      {memberships.isLoading ? <ContentSkeleton /> : null}
      {memberships.isError ? (
        <QueryFeedback error={memberships.error} retry={retryMemberships} />
      ) : null}
      {memberships.data?.length === 0 ? (
        <EmptyState
          description="Explore novos criadores e entre na lista para saber quando as assinaturas estiverem disponíveis."
          icon={Heart}
          title="Encontre quem faz sentido para você"
        >
          <Button nativeButton={false} render={<Link href="/explore" />}>
            Descobrir criadores
          </Button>
        </EmptyState>
      ) : null}
      <div className="divide-y rounded-lg border bg-card">
        {memberships.data?.map((membership) => (
          <Link
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
            href={`/creators/${membership.creator.handle}`}
            key={membership.id}
          >
            <Avatar
              name={membership.creator.displayName}
              size={52}
              src={membership.creator.avatarUrl}
            />
            <div>
              <h2 className="font-semibold">
                {membership.creator.displayName}
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                {membershipStatusLabel(membership.status)}
              </p>
              {membership.expiresAt ? (
                <p className="mt-1 text-muted-foreground text-xs">
                  Até {formatDate(membership.expiresAt)}
                </p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
