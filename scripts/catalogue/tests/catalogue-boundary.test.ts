import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import { handleCatalogueRequest } from "../handle-catalogue-request";
import { requestCatalogue } from "./request-catalogue";

const assets = new Map([
  [
    "/",
    { body: new TextEncoder().encode("catalogue-only"), type: "text/html" },
  ],
]);
const server = createServer((req, res) =>
  handleCatalogueRequest(assets, req, res)
);
let port = 0;
before(async () => {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Missing test address");
  }
  ({ port } = address);
});
after(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test("serves only generated assets with read-only browser boundaries", async () => {
  const result = await requestCatalogue(port, "/");
  assert.equal(result.status, 200);
  assert.equal(result.body, "catalogue-only");
  const csp = result.headers["content-security-policy"] ?? "";
  assert.ok(csp.includes("connect-src 'none'"));
  assert.ok(csp.includes("form-action 'none'"));
  assert.ok(csp.includes("frame-ancestors 'none'"));
  assert.equal(result.headers["x-content-type-options"], "nosniff");
  assert.equal(result.headers["cache-control"], "no-store");
  assert.equal((await requestCatalogue(port, "/", {}, "HEAD")).body, "");
});
for (const path of [
  "/.env",
  "/apps/web/.env",
  "/api/auth/session",
  "/api/rpc",
  "/.next/server",
  "/../.env",
  "/%2e%2e/.env",
  "/?file=.env",
  "/catalogue.js.map",
]) {
  test(`does not expose ${path}`, async () => {
    assert.equal((await requestCatalogue(port, path)).status, 404);
  });
}
for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
  test(`rejects ${method} without action handling`, async () => {
    const result = await requestCatalogue(port, "/", {}, method);
    assert.equal(result.status, 405);
    assert.equal(result.headers.allow, "GET, HEAD");
  });
}
const foreignHeaders: Record<string, string>[] = [
  { Host: "evil.example" },
  { Host: "localhost:53471" },
  { Origin: "https://evil.example" },
  { "Sec-Fetch-Site": "cross-site" },
];
for (const headers of foreignHeaders) {
  test(`rejects foreign request ${JSON.stringify(headers)}`, async () => {
    assert.equal((await requestCatalogue(port, "/", headers)).status, 403);
  });
}
