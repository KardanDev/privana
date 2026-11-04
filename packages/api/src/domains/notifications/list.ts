import { protectedProcedure } from "../../index";
export const listNotifications = protectedProcedure.handler(
  async ({ context }) => {
    const rows = await context.db.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      where: { userId: context.viewer.id },
    });
    return rows.map((row) => ({
      body: row.body,
      createdAt: row.createdAt.toISOString(),
      href: row.href,
      id: row.id,
      readAt: row.readAt?.toISOString() ?? null,
      title: row.title,
    }));
  }
);
