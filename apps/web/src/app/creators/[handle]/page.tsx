import { CreatorPage } from "@/domains/creators/creator-page";

export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return <CreatorPage handle={handle} />;
}
