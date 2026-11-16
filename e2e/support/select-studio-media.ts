import type { Page } from "@playwright/test";

export async function selectStudioMedia(page: Page, changed = false) {
  const buffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aLTsAAAAASUVORK5CYII=",
    "base64"
  );
  if (changed) {
    buffer[buffer.length - 1] = 0;
  }
  await page
    .getByLabel("Adicionar foto ou vídeo", { exact: true })
    .setInputFiles({
      buffer,
      mimeType: "image/png",
      name: "bastidores.png",
    });
}
