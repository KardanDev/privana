import { publicProcedure } from "../../index";
import { readPublishedConfig } from "./read-published-config";
export const getPlatform = publicProcedure.handler(
  async ({ context }) => await readPublishedConfig(context.db)
);
