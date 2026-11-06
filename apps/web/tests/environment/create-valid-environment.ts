export function createValidEnvironment(): Record<string, string> {
  return {
    BETTER_AUTH_SECRET:
      "5f271d4a2d874e1a9ab54fd5a3214cd46ac56d7b4a994ef39257841b5ab31fac",
    DATABASE_URL:
      "postgres://qa:offline-password@db.prisma.io:5432/postgres?sslmode=require",
    EMAIL_DELIVERY_MODE: "resend",
    EMAIL_FROM: "Privana <mail@privana.com>",
    RESEND_API_KEY: "re_f9590c143b8640a384cd13918c871ea5",
  };
}
