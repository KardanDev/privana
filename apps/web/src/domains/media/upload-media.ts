"use client";

import { upload } from "@upstash/blob/browser";
import { z } from "zod";
import { MAX_MEDIA_BYTES, type MediaType } from "./media-policy";

const mediaTypeSchema = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
]);
const completionSchema = z.object({
  mediaKey: z.string(),
  mediaType: mediaTypeSchema,
});
const errorSchema = z.object({ error: z.string() });

export async function uploadMedia(
  file: File,
  userId: string
): Promise<{ mediaKey: string; mediaType: MediaType }> {
  const type = mediaTypeSchema.safeParse(file.type);
  if (!type.success) {
    throw new Error("Escolha uma imagem JPEG, PNG, WebP ou um vídeo MP4.");
  }
  if (file.size <= 0 || file.size > MAX_MEDIA_BYTES) {
    throw new Error("Escolha um arquivo com até 100 MB e conteúdo válido.");
  }
  let pathname: string;
  try {
    const result = await upload(file, { route: "/api/media/upload" }).done;
    pathname = result.path;
    if (!pathname.startsWith(`${userId}/`)) {
      throw new Error("O arquivo não pertence à sua conta.");
    }
  } catch (error) {
    throw new Error(
      "Não foi possível enviar o arquivo. Verifique se o armazenamento está configurado e sua conta de criador foi aprovada.",
      { cause: error }
    );
  }
  const response = await fetch("/api/media/complete", {
    body: JSON.stringify({ pathname }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const payload: unknown = await response.json();
  if (!response.ok) {
    const error = errorSchema.safeParse(payload);
    throw new Error(
      error.success
        ? error.data.error
        : "Não foi possível confirmar o envio do arquivo."
    );
  }
  const completed = completionSchema.safeParse(payload);
  if (
    !completed.success ||
    completed.data.mediaKey !== pathname ||
    completed.data.mediaType !== type.data
  ) {
    throw new Error("A confirmação do arquivo é inválida. Tente novamente.");
  }
  return completed.data;
}
