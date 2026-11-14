import type { ViewerDTO } from "@privana/api/contracts/product";

export function getStudioEntry(
  viewer: ViewerDTO | null | undefined,
  applicationsEnabled: boolean,
  studioLabel: string
): { kind: "application" | "workspace"; label: string } | null {
  if (!viewer) {
    return null;
  }
  if (viewer.creatorId) {
    return {
      kind: "workspace",
      label:
        viewer.creatorStatus === "PENDING" ? "Minha candidatura" : studioLabel,
    };
  }
  return applicationsEnabled
    ? { kind: "application", label: "Quero publicar" }
    : null;
}
