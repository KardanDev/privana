import { test as base, expect } from "@playwright/test";
import { protectAnonymousPage } from "../support/protect-anonymous-page";

export const test = base.extend<{ anonymousSafety: string[] }>({
  anonymousSafety: [
    async ({ baseURL, page }, use) => {
      if (!baseURL) {
        throw new Error("Anonymous smoke requires an explicit base URL.");
      }
      const blocked = await protectAnonymousPage(page, baseURL);
      const errors: string[] = [];
      const collectError = (error: Error) => errors.push(error.message);
      page.on("pageerror", collectError);
      await use(blocked);
      page.off("pageerror", collectError);
      expect(
        blocked,
        "Anonymous UI checks must not attempt external calls or unapproved API writes."
      ).toEqual([]);
      expect(
        errors,
        "Anonymous UI checks must not produce runtime errors."
      ).toEqual([]);
    },
    { auto: true },
  ],
});
