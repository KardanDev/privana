import type { Metadata } from "next";
import { StudioScreen } from "@/domains/studio/studio-screen";
import { requireMember } from "@/shared/auth/require-member";
export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Meu estúdio",
};
export default async function StudioPage() {
  await requireMember();
  return <StudioScreen />;
}
