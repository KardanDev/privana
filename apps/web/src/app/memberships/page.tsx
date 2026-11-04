import { requireMember } from "@/domains/feed/require-member";
import { MembershipsPage } from "@/domains/memberships/memberships-page";

export default async function Page() {
  await requireMember("/memberships");
  return <MembershipsPage />;
}
