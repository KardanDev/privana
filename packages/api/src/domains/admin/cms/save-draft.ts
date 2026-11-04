import { z } from "zod";
import { platformConfigSchema } from "../../../contracts/platform";
import { cmsProcedure } from "../../../index";
import { updateCmsDocument } from "./update-document";
export const saveCmsDraft = cmsProcedure
  .input(
    z
      .object({
        config: platformConfigSchema,
        expectedVersion: z.number().int().min(0).max(2_147_483_646),
      })
      .strict()
  )
  .handler(
    async ({ context, input }) =>
      await updateCmsDocument(
        context.db,
        context.viewer.id,
        input.expectedVersion,
        { config: input.config, kind: "save" }
      )
  );
