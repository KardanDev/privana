import { setTimeout } from "node:timers/promises";

export async function requestDemoSession(account: {
  email: string;
  password: string;
}): Promise<Response> {
  const origin = "http://localhost:3001";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: Retries depend on the previous authentication response.
    const response = await fetch(`${origin}/api/auth/sign-in/email`, {
      body: JSON.stringify(account),
      headers: { "Content-Type": "application/json", Origin: origin },
      method: "POST",
      signal: AbortSignal.timeout(30_000),
    });
    if (response.status !== 429 || attempt === 4) {
      return response;
    }
    process.stdout.write(
      "Authentication rate limit reached; waiting before retrying.\n"
    );
    await setTimeout(15_000);
  }
  throw new Error("Authentication attempts exhausted");
}
