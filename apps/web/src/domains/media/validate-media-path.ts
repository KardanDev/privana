import { ORPCError } from "@orpc/server";
import type { MediaType } from "./media-policy";

const MEDIA_FILENAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp|mp4)$/;
const MIME_BY_EXTENSION: Record<string, MediaType> = {
  jpg: "image/jpeg",
  mp4: "video/mp4",
  png: "image/png",
  webp: "image/webp",
};

export function validateMediaPath(pathname: string, userId: string): MediaType {
  const [owner, filename, extra] = pathname.split("/");
  const match = filename ? MEDIA_FILENAME.exec(filename) : null;
  const mime = match?.[1] ? MIME_BY_EXTENSION[match[1]] : undefined;
  if (!userId || owner !== userId || extra !== undefined || !mime) {
    throw new ORPCError("BAD_REQUEST", {
      message: "O caminho do arquivo é inválido ou não pertence à sua conta.",
    });
  }
  return mime;
}
