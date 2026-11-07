export const previewFiles = new Map([
  ["/", new URL("../index.html", import.meta.url)],
  ...[
    "index.html",
    "styles.css",
    "main.mjs",
    "element.mjs",
    "icon.mjs",
    "icons.svg",
    "render-navigation.mjs",
    "render-card.mjs",
    "render-actions.mjs",
    "render-screen.mjs",
    "scenarios.mjs",
    "toggle-theme.mjs",
  ].map((name) => [`/${name}`, new URL(`../${name}`, import.meta.url)]),
  ...[
    "favicon.svg",
    "wordmark.svg",
    "wordmark-inverse.svg",
    "default-cover.svg",
    "default-avatar.svg",
  ].map((name) => [
    `/brand/${name}`,
    new URL(`../../../../../apps/web/public/brand/${name}`, import.meta.url),
  ]),
]);
