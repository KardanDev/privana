import { ORPCError } from "@orpc/server";
import { Bucket } from "@upstash/blob";
import type { MediaReadOptions } from "./types";

export async function readPrivateMedia(key: string, options: MediaReadOptions) {
  const bucket = new Bucket({ cache: "no-store", token: options.token });
  const info = await bucket.info(key);
  if (info.url || info.metadata.owner !== key.split("/")[0]) {
    throw new ORPCError("SERVICE_UNAVAILABLE");
  }
  // Keep the signed URL server-side. The browser receives only authorized bytes.
  const { url } = await bucket.signedReadUrl(key, { expiresIn: "2m" });
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "If-Match": info.etag,
      ...(options.range ? { Range: options.range } : {}),
    },
    redirect: "error",
    signal: options.signal,
  });
  if (response.status === 416) {
    await response.body?.cancel();
    throw new ORPCError("RANGE_NOT_SATISFIABLE", { status: 416 });
  }
  if (!([200, 206].includes(response.status) && response.body)) {
    await response.body?.cancel();
    throw new ORPCError("SERVICE_UNAVAILABLE");
  }
  return {
    blob: {
      contentType: info.contentType,
      pathname: info.path,
      size: info.size,
    },
    headers: response.headers,
    statusCode: response.status,
    stream: response.body,
  };
}
