import { requireMember } from "@/domains/feed/require-member";
import { SettingsPage } from "@/domains/settings/settings-page";

export default async function Page() {
  await requireMember("/settings");
  return <SettingsPage />;
}
