import type { Page } from "@playwright/test";

export async function fillStudioPostReview(page: Page): Promise<void> {
  await page
    .getByLabel("Título", { exact: true })
    .fill("Bastidores em São Paulo");
  await page
    .getByLabel("Prévia pública", { exact: true })
    .fill("Novidades desta semana");
  await page
    .getByLabel("Sua publicação", { exact: true })
    .fill("Meu rascunho com acentos e uma ideia nova. 💜");
  await page
    .getByLabel("Quem pode ver?", { exact: true })
    .selectOption("SUBSCRIBERS");
  await page
    .getByLabel("Imagem de prévia (link HTTPS)", { exact: true })
    .fill("https://images.example.invalid/preview.png");
}
