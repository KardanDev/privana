"use client";

import { CreatorSuggestions } from "@/domains/feed/creator-suggestions";
import { PostStream } from "@/domains/feed/post-stream";
import { SocialHeading } from "@/domains/feed/social-heading";
import { SocialTabs } from "@/domains/feed/social-tabs";
import { usePlatform } from "@/shared/platform/use-platform";

export function SocialHome() {
  const platform = usePlatform();
  return (
    <div className="grid grid-cols-[minmax(0,640px)] items-start justify-center gap-6 xl:grid-cols-[minmax(0,640px)_280px]">
      <section className="min-w-0 border-x bg-card">
        <SocialHeading title={platform.navigation.home} />
        <SocialTabs active="latest" />
        <PostStream mode="latest" />
      </section>
      <div className="hidden py-5 xl:block">
        <CreatorSuggestions />
      </div>
    </div>
  );
}
