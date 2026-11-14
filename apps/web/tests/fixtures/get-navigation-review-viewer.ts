import type { ViewerDTO } from "@privana/api/contracts/product";

const statuses: Record<string, string> = {
  active: "ACTIVE",
  pending: "PENDING",
  suspended: "SUSPENDED",
  unknown: "UNKNOWN",
};

export function getNavigationReviewViewer(
  scenario: string
): ViewerDTO | null | undefined {
  if (scenario === "anonymous") {
    return null;
  }
  if (scenario === "loading") {
    return undefined;
  }
  const role = scenario === "staff" ? "admin" : scenario;
  return {
    creatorId: statuses[scenario] ? "fictional-profile" : null,
    creatorStatus: statuses[scenario] ?? null,
    email: "fixture@example.invalid",
    id: "fictional-viewer",
    image: null,
    name: "Conta fictícia",
    role: ["admin", "editor", "moderator", "analyst"].includes(role)
      ? role
      : "user",
  };
}
