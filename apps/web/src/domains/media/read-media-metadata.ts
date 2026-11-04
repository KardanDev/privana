import { ORPCError } from "@orpc/server";
import { Bucket } from "@upstash/blob";
import { validateMediaMetadata } from "./validate-media-metadata";
import { validateMediaPath } from "./validate-media-path";
import { verifyStoredMedia } from "./verify-stored-media";

export async function readMediaMetadata(pathname: string, token: string) {
  const bucket = new Bucket({ cache: "no-store", token });
  const info = await bucket.info(pathname);
  if (info.url || info.metadata.owner !== pathname.split("/")[0]) {
    throw new ORPCError("FORBIDDEN");
  }
  const metadata = {
    contentType: info.contentType,
    pathname: info.path,
    size: info.size,
  };
  const mime = validateMediaPath(pathname, pathname.split("/")[0] ?? "");
  validateMediaMetadata(metadata, pathname, mime);
  await verifyStoredMedia(bucket, pathname, mime, info.etag);
  return metadata;
}
