import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { openCheckout } from "./support/open-checkout";
import { reviewTestCard } from "./support/review-test-card";

const NO_SUBSCRIPTION = /nenhuma assinatura foi criada/;
const NO_RECEIPT = /Nenhum recibo, transação financeira ou crédito foi gerado/;
const NO_CHARGE = /Não houve cobrança ou alteração de assinatura/;
const PIX_METHOD = /Pix demonstrativo/;
const NO_CONVERSION = /não consulta taxas de câmbio/;

test("invalid card fields focus the error, then test approval remains uncharged", async ({
  page,
}) => {
  await openCheckout(page);
  await page.getByRole("button", { name: "Revisar simulação" }).click();
  await expect(page.getByLabel("Número de teste")).toBeFocused();
  await expect(page.getByLabel("Número de teste")).toHaveAttribute(
    "aria-invalid",
    "true"
  );
  await reviewTestCard(page);
  await expect(
    page.getByRole("region", { name: "Etapa do checkout" })
  ).toBeFocused();
  await page.getByRole("button", { name: "Simular aprovação" }).click();
  await expect(
    page.getByRole("heading", { name: "Simulação aprovada" })
  ).toBeVisible();
  await expect(page.getByText(NO_SUBSCRIPTION)).toBeVisible();
  await expect(page.getByText(NO_RECEIPT)).toBeVisible();
  await assertNoHorizontalOverflow(page);
  await page.reload();
  await expect(page.getByLabel("Número de teste")).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "Simulação aprovada" })
  ).toHaveCount(0);
});

test("test decline offers a clean retry without retaining card inputs", async ({
  page,
}) => {
  await openCheckout(page);
  await reviewTestCard(page);
  await page.getByRole("button", { name: "Simular recusa" }).click();
  await expect(
    page.getByRole("heading", { name: "Recusa simulada" })
  ).toBeVisible();
  await expect(page.getByText(NO_CHARGE)).toBeVisible();
  await page.getByRole("button", { name: "Testar novamente" }).click();
  await expect(page.getByLabel("Número de teste")).toHaveValue("");
  await expect(page.getByLabel("Validade de teste")).toHaveValue("");
  await expect(page.getByLabel("CVC de teste")).toHaveValue("");
});

test("Pix uses a non-payable example and simulated confirmation", async ({
  page,
}) => {
  await openCheckout(page);
  await page.getByRole("radio", { name: PIX_METHOD }).check();
  await page.getByRole("button", { name: "Revisar simulação" }).click();
  await page.getByRole("button", { name: "Gerar Pix de demonstração" }).click();
  await expect(
    page.getByRole("heading", { name: "Pix ilustrativo" })
  ).toBeVisible();
  await expect(
    page.getByText("DEMONSTRACAO-PIX-NAO-PAGAVEL-SEM-VALOR", { exact: true })
  ).toBeVisible();
  await assertNoHorizontalOverflow(page);
  await page.getByRole("button", { name: "Simular Pix recebido" }).click();
  await expect(
    page.getByRole("heading", { name: "Simulação aprovada" })
  ).toBeVisible();
  await expect(page.getByText(NO_SUBSCRIPTION)).toBeVisible();
});

test("currency changes restrict Pix and clear test card fields", async ({
  page,
}) => {
  await openCheckout(page);
  await page.getByRole("button", { name: "Preencher dados de teste" }).click();
  await page.getByLabel("Moeda da demonstração").selectOption("USD");
  await expect(page.getByRole("radio", { name: PIX_METHOD })).toBeDisabled();
  await expect(page.getByLabel("Número de teste")).toHaveValue("");
  await expect(page.getByLabel("Validade de teste")).toHaveValue("");
  await expect(page.getByLabel("CVC de teste")).toHaveValue("");
  await expect(page.getByText(NO_CONVERSION)).toBeVisible();
  await page.getByLabel("Moeda da demonstração").selectOption("BRL");
  await expect(page.getByRole("radio", { name: PIX_METHOD })).toBeEnabled();
});

test("expired illustrative Pix requires regeneration before confirmation", async ({
  page,
}) => {
  await page.clock.install();
  await openCheckout(page);
  await page.getByRole("radio", { name: PIX_METHOD }).check();
  await page.getByRole("button", { name: "Revisar simulação" }).click();
  await page.getByRole("button", { name: "Gerar Pix de demonstração" }).click();
  await expect(
    page.getByRole("button", { name: "Simular Pix recebido" })
  ).toBeVisible();
  await page.clock.fastForward("05:01");
  await expect(
    page.getByText("Exemplo expirado. Gere outro para continuar o teste.")
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Simular Pix recebido" })
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Gerar outro exemplo" }).click();
  await expect(
    page.getByRole("button", { name: "Simular Pix recebido" })
  ).toBeVisible();
});
