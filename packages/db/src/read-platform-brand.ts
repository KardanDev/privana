import { z } from "zod";
import type { Database } from "./index";

const brandSchema = z.object({
  brand: z.object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .regex(/^[^\r\n]+$/),
  }),
});
export async function readPlatformBrand(db: Database): Promise<string> {
  const document = await db.platformSettings.findUnique({
    select: { published: true },
    where: { id: "platform" },
  });
  return document
    ? brandSchema.parse(document.published).brand.name
    : "Privana";
}
