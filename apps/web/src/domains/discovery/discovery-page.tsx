import { Suspense } from "react";
import { DiscoveryContent } from "@/domains/discovery/discovery-content";
import { ContentSkeleton } from "@/domains/feed/components/content-skeleton";

export function DiscoveryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-5">
          <ContentSkeleton />
        </div>
      }
    >
      <DiscoveryContent />
    </Suspense>
  );
}
