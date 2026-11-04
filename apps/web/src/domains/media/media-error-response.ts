import { ORPCError } from "@orpc/server";
import { BlobError } from "@upstash/blob";
import { ZodError } from "zod";
import { MEDIA_RESPONSE_HEADERS } from "./media-policy";

const MESSAGES: Record<number, string> = {
  400: "Os dados do arquivo são inválidos.",
  401: "Entre na sua conta para continuar.",
  403: "Você não tem permissão para acessar este arquivo.",
  404: "O arquivo não foi encontrado.",
  413: "O arquivo excede o tamanho permitido de 100 MB.",
  415: "O formato do arquivo não é permitido.",
  416: "O intervalo solicitado é inválido.",
  429: "Muitos envios em pouco tempo. Aguarde e tente novamente.",
  500: "Não foi possível processar o arquivo. Tente novamente.",
  502: "O armazenamento não respondeu como esperado. Tente novamente.",
  503: "O envio de arquivos ainda não está disponível.",
};

export function mediaErrorResponse(error: unknown): Response {
  let status = 500;
  if (error instanceof ORPCError) {
    ({ status } = error);
  } else if (error instanceof ZodError) {
    status = 400;
  } else if (BlobError.is(error)) {
    const statuses: Record<string, number> = {
      content_type_not_allowed: 415,
      empty_body: 400,
      forbidden: 403,
      invalid_input: 400,
      not_found: 404,
      rate_limited: 429,
      signature_mismatch: 403,
      too_large: 413,
    };
    status = statuses[error.code] ?? 503;
  }
  return Response.json(
    { error: MESSAGES[status] ?? MESSAGES[500] },
    { headers: MEDIA_RESPONSE_HEADERS, status }
  );
}
