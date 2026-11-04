import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/services";
export async function requireMember() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }
  const user = await db.user.findUnique({
    select: { id: true, name: true, role: true, status: true },
    where: { id: session.user.id },
  });
  if (user?.status !== "ACTIVE") {
    redirect("/login");
  }
  return user;
}
