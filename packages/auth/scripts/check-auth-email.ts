import { randomBytes } from "node:crypto";
import { createPrismaClient } from "@privana/db";
import { createAuth } from "../src/index";
import { verifyResetFlow } from "./email/verify-reset-flow";

// Exercise the actual Better Auth handler and SDK callbacks against Resend's simulator.
// Never print credentials, verification tokens, reset links, or cookie headers.
if (
  process.env.ALLOW_EMAIL_CHECK !== "1" ||
  process.env.NODE_ENV === "production"
) {
  throw new Error("Use ALLOW_EMAIL_CHECK=1 em desenvolvimento.");
}
const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET } = process.env;
if (
  !(DATABASE_URL && BETTER_AUTH_URL && BETTER_AUTH_SECRET) ||
  process.env.EMAIL_DELIVERY_MODE !== "resend"
) {
  throw new Error("Configure Prisma, Better Auth e Resend antes do teste.");
}
const db = createPrismaClient({ DATABASE_URL });
const auth = createAuth(
  {
    BETTER_AUTH_SECRET,
    BETTER_AUTH_URL,
    EMAIL_DELIVERY_MODE: "resend",
    EMAIL_FROM: process.env.EMAIL_FROM,
    NODE_ENV: "development",
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  },
  db
);
const recipient = `delivered+privana-${randomBytes(8).toString("hex")}@resend.dev`;
const password = `Check!${randomBytes(24).toString("base64url")}`;
let verifyUrl: string | undefined;
let resetUrl: string | undefined;
let createdId: string | undefined;
const verification = auth.options.emailVerification;
const passwords = auth.options.emailAndPassword;
const originalVerify = verification.sendVerificationEmail;
const originalReset = passwords.sendResetPassword;
verification.sendVerificationEmail = async (data) => {
  await originalVerify(data);
  verifyUrl = data.url;
};
passwords.sendResetPassword = async (data) => {
  await originalReset(data);
  resetUrl = data.url;
};

try {
  const signup = await auth.handler(
    new Request(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
      body: JSON.stringify({
        callbackURL: `${BETTER_AUTH_URL}/login`,
        email: recipient,
        name: "Resend integration check",
        password,
      }),
      headers: { "Content-Type": "application/json", Origin: BETTER_AUTH_URL },
      method: "POST",
    })
  );
  createdId = (
    await db.user.findUnique({
      select: { id: true },
      where: { email: recipient },
    })
  )?.id;
  if (!(signup.ok && createdId && verifyUrl)) {
    throw new Error(`Falha na confirmação de cadastro: HTTP ${signup.status}.`);
  }
  const verified = await auth.handler(new Request(verifyUrl));
  const user = await db.user.findUnique({ where: { id: createdId } });
  if (verified.status >= 400 || !user?.emailVerified) {
    throw new Error("O link de confirmação não confirmou a conta.");
  }
  const reset = await auth.handler(
    new Request(`${BETTER_AUTH_URL}/api/auth/request-password-reset`, {
      body: JSON.stringify({
        email: recipient,
        redirectTo: `${BETTER_AUTH_URL}/reset-password`,
      }),
      headers: { "Content-Type": "application/json", Origin: BETTER_AUTH_URL },
      method: "POST",
    })
  );
  if (!(reset.ok && resetUrl)) {
    throw new Error(`Falha na recuperação de senha: HTTP ${reset.status}.`);
  }
  const resetResult = await verifyResetFlow({
    handler: auth.handler,
    origin: BETTER_AUTH_URL,
    originalPassword: password,
    recipient,
    resetUrl,
  });
  process.stdout.write(
    `${JSON.stringify({ recipient, registration: "passed", resetEmail: "accepted by Resend SDK", verificationEmail: "accepted by Resend SDK", verificationLink: "confirmed", ...resetResult })}\n`
  );
} finally {
  if (createdId) {
    await db.user.deleteMany({
      where: {
        email: recipient,
        id: createdId,
        name: "Resend integration check",
      },
    });
  }
  await db.$disconnect();
}
