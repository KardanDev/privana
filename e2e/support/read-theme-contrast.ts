import type { Page } from "@playwright/test";

export async function readThemeContrast(page: Page) {
  return await page.evaluate(() => {
    const pairs: [string, string, number][] = [
      ["foreground", "background", 4.5],
      ["card-foreground", "card", 4.5],
      ["popover-foreground", "popover", 4.5],
      ["muted-foreground", "card", 4.5],
      ["muted-foreground", "secondary", 4.5],
      ["primary-foreground", "primary", 4.5],
      ["primary-foreground", "primary-hover", 4.5],
      ["primary", "background", 4.5],
      ["primary", "card", 4.5],
      ["primary", "secondary", 4.5],
      ["primary", "accent", 4.5],
      ["primary", "sidebar", 4.5],
      ["secondary-foreground", "secondary", 4.5],
      ["secondary-foreground", "secondary-hover", 4.5],
      ["accent-foreground", "accent", 4.5],
      ["sidebar-foreground", "sidebar", 4.5],
      ["sidebar-primary-foreground", "sidebar-primary", 4.5],
      ["success", "success-surface", 4.5],
      ["warning", "warning-surface", 4.5],
      ["destructive", "destructive-surface", 4.5],
      ["info", "info-surface", 4.5],
      ["input", "card", 3],
      ["ring", "card", 3],
      ["ring", "background", 3],
      ...[1, 2, 3, 4, 5].map((index): [string, string, number] => [
        `chart-${index}`,
        "card",
        3,
      ]),
    ];
    const probe = document.createElement("span");
    probe.style.visibility = "hidden";
    probe.style.position = "fixed";
    // Reduced-motion CSS still assigns a tiny transition duration globally.
    // Measure the resolved token, rather than the previous frame's color.
    probe.style.setProperty("transition", "none", "important");
    document.body.append(probe);
    const context = document.createElement("canvas").getContext("2d");
    if (!context) {
      throw new Error("Theme contrast checks require a canvas context.");
    }
    try {
      return pairs.map(([foreground, background, minimum]) => {
        probe.style.color = `var(--${foreground})`;
        probe.style.backgroundColor = `var(--${background})`;
        const { color: foregroundColor, backgroundColor } =
          getComputedStyle(probe);
        const luminances: number[] = [];
        for (const color of [foregroundColor, backgroundColor]) {
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          const pixel = context.getImageData(0, 0, 1, 1).data;
          let luminance = 0;
          const weights = [0.2126, 0.7152, 0.0722];
          for (const [index, channel] of pixel.slice(0, 3).entries()) {
            const value = channel / 255;
            const linear =
              value <= 0.040_45
                ? value / 12.92
                : ((value + 0.055) / 1.055) ** 2.4;
            luminance += (weights[index] ?? 0) * linear;
          }
          luminances.push(luminance);
        }
        return {
          background,
          backgroundColor,
          foreground,
          foregroundColor,
          minimum,
          ratio:
            (Math.max(...luminances) + 0.05) / (Math.min(...luminances) + 0.05),
        };
      });
    } finally {
      probe.remove();
    }
  });
}
