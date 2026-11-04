import { requireMember } from "@/domains/feed/require-member";
import { NotificationsPage } from "@/domains/notifications/notifications-page";

export default async function Page() {
  await requireMember("/notifications");
  return <NotificationsPage />;
}
