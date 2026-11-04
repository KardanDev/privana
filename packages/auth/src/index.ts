import type { Database } from "@privana/db";
import { readPlatformBrand } from "@privana/db/read-platform-brand";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { assertRegistrationEnabled } from "./assert-registration-enabled";
import type { EmailConfig } from "./email/config";
import { renderAuthEmail } from "./email/render-auth-email";
import { sendEmail } from "./email/send-email";
import { validateEmailConfig } from "./email/validate-email-config";
import { createRedisRateLimit } from "./rate-limit/create-redis-rate-limit";

export type AuthConfig = EmailConfig & {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
};

export function createAuth(env: AuthConfig, database: Database) {
  return betterAuth({
    advanced: {
      cookiePrefix: "privana",
      useSecureCookies: env.NODE_ENV === "production",
    },
    appName: "Privana",
    baseURL: env.BETTER_AUTH_URL,
    database: prismaAdapter(database, {
      provider: "postgresql",
      transaction: true,
    }),
    databaseHooks: {
      session: {
        create: {
          before: async (session) => {
            const user = await database.user.findUnique({
              select: { status: true },
              where: { id: session.userId },
            });
            if (user?.status !== "ACTIVE") {
              throw new APIError("FORBIDDEN", {
                message:
                  "Esta conta está suspensa. Entre em contato com a Privana.",
              });
            }
            return { data: session };
          },
        },
      },
      user: {
        create: {
          before: async (user) => {
            await assertRegistrationEnabled(database);
            return { data: user };
          },
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      maxPasswordLength: 128,
      minPasswordLength: 12,
      requireEmailVerification: true,
      resetPasswordTokenExpiresIn: 60 * 30,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        const brandName = await readPlatformBrand(database);
        await sendEmail(env, {
          to: user.email,
          ...renderAuthEmail({
            brandName,
            kind: "reset",
            name: user.name,
            url,
          }),
        });
      },
    },
    emailVerification: {
      autoSignInAfterVerification: false,
      expiresIn: 60 * 60,
      sendOnSignIn: true,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        const brandName = await readPlatformBrand(database);
        await sendEmail(env, {
          to: user.email,
          ...renderAuthEmail({
            brandName,
            kind: "verify",
            name: user.name,
            url,
          }),
        });
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/sign-up/email") {
          await assertRegistrationEnabled(database);
        }
        if (
          [
            "/sign-up/email",
            "/sign-in/email",
            "/request-password-reset",
            "/send-verification-email",
          ].includes(ctx.path)
        ) {
          try {
            validateEmailConfig(env);
          } catch (error) {
            throw new APIError("SERVICE_UNAVAILABLE", {
              cause: error,
              message:
                error instanceof Error
                  ? error.message
                  : "O envio de e-mails está indisponível.",
            });
          }
        }
      }),
    },
    plugins: [nextCookies()],
    rateLimit: {
      customRules: {
        "/request-password-reset": { max: 3, window: 60 },
        "/send-verification-email": { max: 3, window: 60 },
        "/sign-in/email": { max: 5, window: 60 },
        "/sign-up/email": { max: 3, window: 60 },
      },
      customStorage: createRedisRateLimit(env),
      enabled: true,
      max: 60,
      storage: "database",
      window: 60,
    },
    secret: env.BETTER_AUTH_SECRET,
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    trustedOrigins: [env.BETTER_AUTH_URL],
    user: {
      additionalFields: {
        emailNotifications: {
          defaultValue: true,
          input: false,
          type: "boolean",
        },
        locale: { defaultValue: "pt-BR", input: false, type: "string" },
        role: { defaultValue: "member", input: false, type: "string" },
        status: { defaultValue: "ACTIVE", input: false, type: "string" },
      },
    },
  });
}

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];
