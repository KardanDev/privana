export function readBrowserTarget(
  env: Record<string, string | undefined>
): string {
  if (
    env.ALLOW_BROWSER_SMOKE !== "1" ||
    env.NODE_ENV === "production" ||
    env.VERCEL_ENV === "production"
  ) {
    throw new Error(
      "Browser smoke requires ALLOW_BROWSER_SMOKE=1 outside production."
    );
  }
  let target: URL;
  try {
    target = new URL(env.BROWSER_SMOKE_ORIGIN ?? "");
  } catch (cause) {
    throw new Error(
      "Set BROWSER_SMOKE_ORIGIN to an explicit loopback HTTP origin and port.",
      { cause }
    );
  }
  if (
    !(
      ["http:", "https:"].includes(target.protocol) &&
      ["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) &&
      target.port
    ) ||
    target.username ||
    target.password ||
    target.pathname !== "/" ||
    target.search ||
    target.hash
  ) {
    throw new Error(
      "Browser smoke accepts only a loopback origin with a port and no credentials, path or query."
    );
  }
  return target.origin;
}
