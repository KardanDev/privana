"use client";

import { OperationsContent } from "./operations-content";
import { OperationsShell } from "./operations-shell";
import { useOperationsNavigation } from "./use-operations-navigation";

export function AdminScreen({
  viewerId,
  viewerName,
  viewerRole,
}: {
  viewerId: string;
  viewerName: string;
  viewerRole: string;
}) {
  const navigation = useOperationsNavigation(viewerRole);
  return (
    <OperationsShell
      onSelect={navigation.select}
      section={navigation.section}
      viewerName={viewerName}
      viewerRole={viewerRole}
    >
      <OperationsContent
        section={navigation.section}
        viewerId={viewerId}
        viewerRole={viewerRole}
      />
    </OperationsShell>
  );
}
