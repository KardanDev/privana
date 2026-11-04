import { ORPCError } from "@orpc/server";
import { MAX_MEDIA_BYTES, type MediaType } from "./media-policy";

export function validateMediaMetadata(
  blob: { pathname: string; contentType: string; size: number },
  pathname: string,
  mime: MediaType
): void {
  if (blob.pathname !== pathname || blob.contentType !== mime) {
    throw new ORPCError("BAD_REQUEST", {
      message:
        "O tipo ou o caminho do arquivo não corresponde ao envio autorizado.",
    });
  }
  if (
    !Number.isSafeInteger(blob.size) ||
    blob.size <= 0 ||
    blob.size > MAX_MEDIA_BYTES
  ) {
    throw new ORPCError("PAYLOAD_TOO_LARGE", {
      message: "Escolha um arquivo com até 100 MB e conteúdo válido.",
    });
  }
}
