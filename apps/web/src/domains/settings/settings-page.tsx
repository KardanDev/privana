"use client";

import { Button } from "@privana/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Heart } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { ContentSkeleton } from "@/domains/feed/components/content-skeleton";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { SocialHeading } from "@/domains/feed/social-heading";
import { SettingsForm } from "@/domains/settings/settings-form";
import { usePlatform } from "@/shared/platform/use-platform";
import { client } from "@/utils/orpc";
export function SettingsPage() {
  const platform = usePlatform();
  const settings = useQuery({
    queryFn: () => client.settings.get(),
    queryKey: ["settings"],
  });
  const retrySettings = useCallback(() => settings.refetch(), [settings]);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <SocialHeading title="Configurações" />
      <nav aria-label="Seu conteúdo" className="flex flex-wrap gap-3">
        <Button
          nativeButton={false}
          render={<Link href="/saved" />}
          variant="outline"
        >
          <Bookmark data-icon="inline-start" />
          {platform.navigation.saved}
        </Button>
        <Button
          nativeButton={false}
          render={<Link href="/memberships" />}
          variant="outline"
        >
          <Heart data-icon="inline-start" />
          {platform.navigation.memberships}
        </Button>
      </nav>
      {settings.isLoading ? <ContentSkeleton /> : null}
      {settings.isError ? (
        <QueryFeedback error={settings.error} retry={retrySettings} />
      ) : null}
      {settings.data ? <SettingsForm settings={settings.data} /> : null}
    </div>
  );
}
