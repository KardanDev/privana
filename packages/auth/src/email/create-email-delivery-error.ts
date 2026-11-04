import { APIError } from "better-auth/api";

export function createEmailDeliveryError(error: unknown): APIError {
  const name =
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
      ? error.name
      : "application_error";
  const statusCode =
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
      ? error.statusCode
      : null;
  let message =
    "Não foi possível conectar ao Resend. Tente novamente em alguns instantes.";
  if (
    ["invalid_api_key", "missing_api_key", "restricted_api_key"].includes(
      name
    ) ||
    statusCode === 401
  ) {
    message =
      "O Resend recusou a chave de envio. Configure RESEND_API_KEY com uma chave válida e permissão de envio.";
  } else if (name === "invalid_from_address" || statusCode === 403) {
    message =
      "O Resend recusou o remetente. Confira EMAIL_FROM e verifique o domínio exato no Resend. O remetente de teste resend.dev tem restrições de destinatário.";
  } else if (
    statusCode === 429 ||
    [
      "rate_limit_exceeded",
      "daily_quota_exceeded",
      "monthly_quota_exceeded",
    ].includes(name)
  ) {
    message =
      "O limite de envio do Resend foi atingido. Aguarde ou confira a cota da conta antes de reenviar.";
  } else if (statusCode === 400 || statusCode === 422) {
    message =
      "O Resend recusou os dados do e-mail. Confira o formato de EMAIL_FROM e a configuração de envio.";
  }
  return new APIError("SERVICE_UNAVAILABLE", {
    code: "EMAIL_DELIVERY_FAILED",
    message,
  });
}
