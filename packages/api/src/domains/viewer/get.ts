import { publicProcedure } from "../../index";
export const getViewer = publicProcedure.handler(async ({ context }) => {
  if (!context.viewer) {
    return null;
  }
  const p = await context.db.creatorProfile.findUnique({
    where: { userId: context.viewer.id },
  });
  return {
    creatorId: p?.id ?? null,
    creatorStatus: p?.status ?? null,
    email: context.viewer.email,
    id: context.viewer.id,
    image: context.viewer.image,
    name: context.viewer.name,
    role: context.viewer.role,
  };
});
