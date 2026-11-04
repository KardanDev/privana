import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { APIError } from "better-auth/api";
import type { EmailConfig, EmailMessage } from "./config";
import { createEmailDeliveryError } from "./create-email-delivery-error";
import { createResendProvider } from "./create-resend-provider";
import type { EmailProvider, EmailProviderFactory } from "./email-provider";
import { validateEmailConfig } from "./validate-email-config";

export async function sendEmail(
  config: EmailConfig,
  message: EmailMessage,
  createProvider: EmailProviderFactory = createResendProvider
): Promise<void> {
  const mode = validateEmailConfig(config);
  if (mode === "preview") {
    if (process.env.NODE_ENV !== "production") {
      const directory = resolve(
        config.EMAIL_PREVIEW_DIRECTORY ?? ".local-mail"
      );
      await mkdir(directory, { mode: 0o700, recursive: true });
      await writeFile(
        join(directory, `${Date.now()}-${randomUUID()}.html`),
        message.html,
        { mode: 0o600 }
      );
      return;
    }
    throw new Error(
      "EMAIL_DELIVERY_MODE=preview não está disponível no runtime de produção. Configure resend."
    );
  }
  const from = config.EMAIL_FROM?.trim();
  const apiKey = config.RESEND_API_KEY?.trim();
  if (!(from && apiKey)) {
    throw new Error(
      "Configure RESEND_API_KEY e EMAIL_FROM para enviar e-mails pelo Resend."
    );
  }
  const payload = { ...message, from, to: [message.to] };
  const idempotencyKey = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
  let response: Awaited<ReturnType<EmailProvider["send"]>>;
  try {
    response = await createProvider(apiKey).send(payload, {
      idempotencyKey: `auth/${idempotencyKey}`,
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw createEmailDeliveryError(error);
  }
  if (response.error) {
    throw createEmailDeliveryError(response.error);
  }
  if (!response.data?.id) {
    throw new APIError("SERVICE_UNAVAILABLE", {
      code: "EMAIL_DELIVERY_FAILED",
      message:
        "O Resend não confirmou o envio do e-mail. Tente novamente mais tarde.",
    });
  }
}
