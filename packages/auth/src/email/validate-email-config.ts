import type { EmailConfig } from "./config";

export function validateEmailConfig(config: EmailConfig): "preview" | "resend" {
  if (config.EMAIL_DELIVERY_MODE === "preview") {
    if (config.NODE_ENV === "production") {
      throw new Error(
        "EMAIL_DELIVERY_MODE=preview é permitido apenas no desenvolvimento. Configure resend em produção."
      );
    }
    return "preview";
  }
  if (config.EMAIL_DELIVERY_MODE !== "resend") {
    throw new Error(
      "Configure EMAIL_DELIVERY_MODE=resend ou, no desenvolvimento, preview."
    );
  }
  if (!(config.RESEND_API_KEY?.trim() && config.EMAIL_FROM?.trim())) {
    throw new Error(
      "Configure RESEND_API_KEY e EMAIL_FROM com um domínio verificado para enviar e-mails."
    );
  }
  return "resend";
}
