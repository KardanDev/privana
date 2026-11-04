import { cmsProcedure } from "../../../index";
import { serializeCmsDocument } from "./serialize-document";
export const getCms = cmsProcedure.handler(async ({ context }) =>
  serializeCmsDocument(
    await context.db.platformSettings.findUnique({ where: { id: "platform" } })
  )
);
