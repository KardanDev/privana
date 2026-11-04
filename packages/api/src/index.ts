import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";
export const o = os.$context<Context>();
export const publicProcedure = o.use(async ({ context, next }) => {
  const viewer = context.session?.user.id
    ? await context.db.user.findUnique({
        where: { id: context.session.user.id },
      })
    : null;
  return next({
    context: { viewer: viewer?.status === "ACTIVE" ? viewer : null },
  });
});
export const protectedProcedure = publicProcedure.use(({ context, next }) => {
  if (!context.viewer) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "Entre com uma conta ativa para continuar.",
    });
  }
  return next({ context: { viewer: context.viewer } });
});
export const adminProcedure = protectedProcedure.use(({ context, next }) => {
  if (context.viewer.role !== "admin") {
    throw new ORPCError("FORBIDDEN");
  }
  return next({ context: { viewer: context.viewer } });
});
export const cmsProcedure = protectedProcedure.use(({ context, next }) => {
  if (context.viewer.role !== "admin" && context.viewer.role !== "editor") {
    throw new ORPCError("FORBIDDEN");
  }
  return next({ context: { viewer: context.viewer } });
});
export const moderationProcedure = protectedProcedure.use(
  ({ context, next }) => {
    if (
      context.viewer.role !== "admin" &&
      context.viewer.role !== "moderator"
    ) {
      throw new ORPCError("FORBIDDEN");
    }
    return next({ context: { viewer: context.viewer } });
  }
);
export const financeProcedure = protectedProcedure.use(({ context, next }) => {
  if (context.viewer.role !== "admin" && context.viewer.role !== "analyst") {
    throw new ORPCError("FORBIDDEN");
  }
  return next({ context: { viewer: context.viewer } });
});
