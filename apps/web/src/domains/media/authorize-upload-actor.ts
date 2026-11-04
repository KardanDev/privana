import { ORPCError } from "@orpc/server";
import { auth, db } from "@/services";

export async function authorizeUploadActor(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });
  if (!session) {
    throw new ORPCError("UNAUTHORIZED");
  }
  const user = await db.user.findUnique({
    select: {
      creatorProfile: { select: { status: true } },
      id: true,
      status: true,
    },
    where: { id: session.user.id },
  });
  if (user?.status !== "ACTIVE" || user.creatorProfile?.status !== "ACTIVE") {
    throw new ORPCError("FORBIDDEN");
  }
  return user.id;
}
