import { z } from "zod";
import { cmsProcedure } from "../../../index";
import { updateCmsDocument } from "./update-document";
export const publishCms = cmsProcedure
  .input(
    z
      .object({ expectedVersion: z.number().int().min(0).max(2_147_483_646) })
      .strict()
  )
  .handler(
    async ({ context, input }) =>
      await updateCmsDocument(
        context.db,
        context.viewer.id,
        input.expectedVersion,
        { kind: "publish" }
      )
  );
