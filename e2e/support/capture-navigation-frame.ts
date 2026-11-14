import { writeFile } from "node:fs/promises";
import type { Page, TestInfo } from "@playwright/test";

export async function captureNavigationFrame(
  page: Page,
  testInfo: TestInfo,
  name: string
): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
  const frame = `${name}.jpg`;
  const path = testInfo.outputPath(frame);
  await page.screenshot({ path, quality: 88, type: "jpeg" });
  await writeFile(
    testInfo.outputPath(`${name}.json`),
    JSON.stringify(
      {
        dark: await page
          .locator("html")
          .evaluate((root) => root.classList.contains("dark")),
        frame,
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth
        ),
        project: testInfo.project.name,
        test: testInfo.title,
        viewport: page.viewportSize(),
      },
      null,
      2
    )
  );
  await testInfo.attach(name, { contentType: "image/jpeg", path });
}
