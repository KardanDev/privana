import { z } from "zod";
import { protectedProcedure } from "../../index";
import { publicUrl } from "../shared/query-shapes";
export const updateSettings = protectedProcedure
  .input(
    z.object({
      emailNotifications: z.boolean(),
      image: publicUrl,
      locale: z.literal("pt-BR").default("pt-BR"),
      name: z.string().trim().min(2).max(80),
    })
  )
  .handler(async ({ context, input }) => {
    const row = await context.db.user.update({
      data: input,
      where: { id: context.viewer.id },
    });
    return {
      emailNotifications: row.emailNotifications,
      image: row.image,
      locale: row.locale,
      name: row.name,
    };
  });
