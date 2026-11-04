export function assertDemoSeedAllowed(
  env: Record<string, string | undefined>
): string {
  if (
    env.ALLOW_DEMO_SEED !== "1" ||
    !["development", "test"].includes(env.NODE_ENV ?? "") ||
    env.VERCEL_ENV === "production"
  ) {
    throw new Error(
      "Use ALLOW_DEMO_SEED=1 e NODE_ENV=development em um banco de desenvolvimento. Produção é bloqueada."
    );
  }
  if (!env.DATABASE_URL?.trim()) {
    throw new Error("Defina DATABASE_URL para o banco de desenvolvimento.");
  }
  return env.DATABASE_URL;
}
