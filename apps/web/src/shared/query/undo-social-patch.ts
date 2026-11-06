import type { QueryClient } from "@tanstack/react-query";
import { rollbackSocialPatch } from "./rollback-social-patch";
import type { SocialPatch, SocialSnapshot } from "./social-patch";

export function undoSocialPatch(
  client: QueryClient,
  snapshots: SocialSnapshot | undefined,
  patch: SocialPatch
): void {
  for (const snapshot of snapshots ?? []) {
    client.setQueryData(snapshot.key, (current: unknown) =>
      rollbackSocialPatch(current, snapshot.data, patch)
    );
  }
}
