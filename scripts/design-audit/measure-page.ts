import type { Page } from "@playwright/test";

export async function measurePage(page: Page) {
  return await page.evaluate(() => ({
    headings: [...document.querySelectorAll("h1,h2")]
      .map((node) => node.textContent?.trim())
      .slice(0, 8),
    horizontalOverflow:
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
    inputs: document.querySelectorAll("input,textarea,select").length,
    lang: document.documentElement.lang,
    navigation: [...document.querySelectorAll("nav")].map((node) => ({
      destinations: [...node.querySelectorAll("a,button")]
        .map((item) => item.getAttribute("href") ?? item.getAttribute("value"))
        .filter(Boolean),
      name: node.getAttribute("aria-label"),
    })),
    skeletons: document.querySelectorAll('[data-slot="skeleton"]').length,
    theme: document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
    title: document.title,
    width: innerWidth,
  }));
}
