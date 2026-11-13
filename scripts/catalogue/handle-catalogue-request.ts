import type { IncomingMessage, ServerResponse } from "node:http";
import { type CatalogueAssets, catalogueOrigin } from "./catalogue-assets";

export function handleCatalogueRequest(
  assets: CatalogueAssets,
  request: IncomingMessage,
  response: ServerResponse
) {
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'"
  );
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  response.setHeader("Cache-Control", "no-store");
  const foreign =
    request.headers.host !== "127.0.0.1:53471" ||
    (request.headers.origin !== undefined &&
      request.headers.origin !== catalogueOrigin) ||
    request.headers["sec-fetch-site"] === "cross-site";
  if (foreign) {
    response.writeHead(403).end();
    return;
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  const asset = assets.get(request.url ?? "");
  if (!asset) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    "Content-Length": asset.body.byteLength,
    "Content-Type": asset.type,
  });
  response.end(request.method === "HEAD" ? undefined : asset.body);
}
