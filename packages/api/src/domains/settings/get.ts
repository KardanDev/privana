import { protectedProcedure } from "../../index";
export const getSettings = protectedProcedure.handler(({ context }) => ({
  emailNotifications: context.viewer.emailNotifications,
  image: context.viewer.image,
  locale: context.viewer.locale,
  name: context.viewer.name,
}));
