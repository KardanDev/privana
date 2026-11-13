// biome-ignore-all lint/performance/noAwaitInLoops: Each case changes one document's theme before reading its computed styles.
import { expect, test } from "@playwright/test";
import { protectAnonymousPage } from "./support/protect-anonymous-page";
import { readThemeContrast } from "./support/read-theme-contrast";

test("published accents keep document-level theme pairs readable", async ({
  baseURL,
  page,
}, testInfo) => {
  if (!baseURL) {
    throw new Error(
      "Theme checks require an explicit local application origin."
    );
  }
  const blocked = await protectAnonymousPage(page, baseURL);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  await expect(page.getByLabel("Seu e-mail", { exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const families = await page.evaluate(() => {
    const heading = document.querySelector("h1");
    if (!heading) {
      throw new Error(
        "The login heading must render before checking its fonts."
      );
    }
    return {
      body: getComputedStyle(document.body).fontFamily,
      heading: getComputedStyle(heading).fontFamily,
    };
  });
  expect(families.body).toContain("Hanken Grotesk");
  expect(families.heading).toContain("Bricolage Grotesque");
  const measurements: Array<{
    accent: string;
    dark: boolean;
    pairs: Awaited<ReturnType<typeof readThemeContrast>>;
  }> = [];

  for (const dark of [false, true]) {
    for (const accent of [
      "#6D28D9",
      "#000000",
      "#767676",
      "#c60000",
      "#006b52",
    ]) {
      await page.evaluate(
        ({ accent: publishedAccent, dark: darkTheme }) => {
          document.documentElement.classList.toggle("dark", darkTheme);
          document.documentElement.style.setProperty(
            "--brand-accent",
            publishedAccent
          );
        },
        { accent, dark }
      );
      const pairs = await readThemeContrast(page);
      measurements.push({ accent, dark, pairs });
      for (const pair of pairs) {
        expect
          .soft(
            pair.ratio,
            `${dark ? "dark" : "light"} ${accent}: ${pair.foreground}/${pair.background}`
          )
          .toBeGreaterThanOrEqual(pair.minimum);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth)
      ).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
    }
  }
  expect(blocked).toEqual([]);
  expect(errors).toEqual([]);
  await testInfo.attach("theme-contrast", {
    body: JSON.stringify(measurements, null, 2),
    contentType: "application/json",
  });
});
