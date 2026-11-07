import { expect, test } from "bun:test";
import { respond } from "./respond.mjs";

test("review server cannot expose services, environment, server source or traversal targets", async () => {
  const responses = await Promise.all(
    [
      "/.env",
      "/apps/web/.env",
      "/api/auth/session",
      "/api/rpc/admin",
      "/server/start.mjs",
      "/%2e%2e/%2e%2e/.env",
      "/main.mjs%00",
    ].map((path) => respond(new Request(`http://127.0.0.1:53470${path}`)))
  );
  for (const response of responses) {
    expect(response.status).toBe(404);
  }
});
test("review server rejects writes even to allowlisted assets", async () => {
  const responses = await Promise.all(
    ["POST", "PUT", "PATCH", "DELETE"].map((method) =>
      respond(new Request("http://127.0.0.1:53470/", { method }))
    )
  );
  for (const response of responses) {
    expect(response.status).toBe(405);
  }
});
test("review assets carry the no-service and no-submit policy", async () => {
  const response = await respond(new Request("http://127.0.0.1:53470/"));
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Security-Policy")).toContain(
    "connect-src 'none'"
  );
  expect(response.headers.get("Content-Security-Policy")).toContain(
    "form-action 'none'"
  );
  expect(await response.text()).toContain("Nenhuma operação real");
  expect(
    (await respond(new Request("http://127.0.0.1:53470/", { method: "HEAD" })))
      .body
  ).toBeNull();
});
test("approved brand files are available without project-directory access", async () => {
  const response = await respond(
    new Request("http://127.0.0.1:53470/brand/wordmark.svg")
  );
  expect(response.headers.get("Content-Type")).toContain("image/svg+xml");
  expect(await response.text()).toContain("Privana");
});
