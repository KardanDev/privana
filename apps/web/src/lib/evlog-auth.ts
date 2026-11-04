import {
  type BetterAuthInstance,
  createAuthMiddleware,
} from "evlog/better-auth";

import { useLogger as getRequestLogger } from "@/lib/evlog";

import { auth } from "../services";

const identifyUser = createAuthMiddleware(auth as BetterAuthInstance, {
  exclude: ["/api/auth/**"],
  maskEmail: true,
});

export async function identifyEvlogUser(request: Request) {
  await identifyUser(
    getRequestLogger(),
    request.headers,
    new URL(request.url).pathname
  );
}
