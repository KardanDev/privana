import { setTimeout } from "node:timers/promises";
import type { BrowserContext } from "@playwright/test";

export async function signInBaseline(
  context: BrowserContext,
  origin: string,
  account: { email: string; password: string; key: string }
): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: Retry only after the previous rate-limit response.
    const response = await context.request.post(
      `${origin}/api/auth/sign-in/email`,
      {
        data: { email: account.email, password: account.password },
        headers: { Origin: origin },
        timeout: 30_000,
      }
    );
    if (response.status() === 200) {
      return;
    }
    if (response.status() !== 429 || attempt === 2) {
      throw new Error(
        `Authentication failed for fixture ${account.key}: HTTP ${response.status()}.`
      );
    }
    const retry = Number(response.headers()["retry-after"]);
    if (!Number.isFinite(retry) || retry > 60) {
      throw new Error(
        "Authentication rate limit requires a later retry; do not bypass the server limit."
      );
    }
    process.stdout.write(
      `Waiting for authentication rate limit: ${account.key}.\n`
    );
    await setTimeout(Math.max(15, retry) * 1000);
  }
}
