import { requireMember } from "@/domains/feed/require-member";
import { MessagesPage } from "@/domains/messages/messages-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>;
}) {
  const { conversation } = await searchParams;
  await requireMember("/messages");
  return <MessagesPage initialConversation={conversation} />;
}
