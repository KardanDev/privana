export function requireDemoSmokeEnvironment(
  env: Record<string, string | undefined>
): void {
  if (
    env.ALLOW_DEMO_SMOKE !== "1" ||
    (env.NODE_ENV !== "development" && env.NODE_ENV !== "test") ||
    env.VERCEL_ENV === "production"
  ) {
    throw new Error(
      "Demo HTTP smoke requires ALLOW_DEMO_SMOKE=1 and an explicit development/test environment outside production."
    );
  }
}
