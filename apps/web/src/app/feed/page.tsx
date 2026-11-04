import { FeedPage } from "@/domains/feed/feed-page";
import { requireMember } from "@/domains/feed/require-member";

export default async function Page() {
  await requireMember("/feed");
  return <FeedPage />;
}
