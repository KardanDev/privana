import assert from "node:assert/strict";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { AppRouterClient } from "../../src/routers/index";
import { requestDemoSession } from "./request-demo-session";

export async function signInDemo(account: {
  email: string;
  password: string;
  role: string;
}) {
  const origin = "http://localhost:3001";
  const response = await requestDemoSession({
    email: account.email,
    password: account.password,
  });
  assert.equal(response.status, 200, `Login failed for ${account.email}`);
  const cookie = response.headers
    .getSetCookie()
    .map((item) => item.split(";")[0])
    .join("; ");
  assert.ok(cookie.includes("session_token"), "Missing authenticated session");
  const client: AppRouterClient = createORPCClient(
    new RPCLink({
      headers: { Cookie: cookie, Origin: origin },
      url: `${origin}/api/rpc`,
    })
  );
  const viewer = await client.viewer.get();
  assert.equal(viewer?.email, account.email);
  assert.equal(viewer?.role, account.role);
  return { client, cookie, viewer };
}
