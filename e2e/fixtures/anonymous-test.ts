import { test as base, expect } from "@playwright/test";
import { protectAnonymousPage } from "../support/protect-anonymous-page";

export const test = base.extend<{ anonymousSafety: string[] }>({
  anonymousSafety: [
    async ({ baseURL, page }, use) => {
      if (!baseURL) {
        throw new Error("Anonymous smoke requires an explicit base URL.");
      }
      const blocked = await protectAnonymousPage(page, baseURL);
      await use(blocked);
      expect(
        blocked,
        "Checkout must not attempt external calls or unapproved API writes."
      ).toEqual([]);
    },
    { auto: true },
  ],
});
