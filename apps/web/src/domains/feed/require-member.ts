import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/services";

export async function requireMember(returnTo: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
  return session.user;
}
