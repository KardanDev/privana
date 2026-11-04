import { randomBytes } from "node:crypto";

interface ResetCheck {
  handler: (request: Request) => Promise<Response>;
  origin: string;
  originalPassword: string;
  recipient: string;
  resetUrl: string;
}

export async function verifyResetFlow({
  handler,
  origin,
  originalPassword,
  recipient,
  resetUrl,
}: ResetCheck) {
  const callback = await handler(new Request(resetUrl));
  const location = callback.headers.get("location");
  if (callback.status !== 302 || !location) {
    throw new Error(
      "O link de recuperação não redirecionou para o formulário."
    );
  }
  const destination = new URL(location);
  const token = destination.searchParams.get("token");
  if (
    destination.origin !== new URL(origin).origin ||
    destination.pathname !== "/reset-password" ||
    !token
  ) {
    throw new Error("O destino da recuperação de senha é inválido.");
  }
  const replacementPassword = `Reset!${randomBytes(24).toString("base64url")}`;
  const resetRequest = new Request(`${origin}/api/auth/reset-password`, {
    body: JSON.stringify({ newPassword: replacementPassword, token }),
    headers: { "Content-Type": "application/json", Origin: origin },
    method: "POST",
  });
  const reusedRequest = resetRequest.clone();
  const reset = await handler(resetRequest);
  if (!reset.ok) {
    throw new Error(`A redefinição de senha falhou: HTTP ${reset.status}.`);
  }
  const reused = await handler(reusedRequest);
  if (reused.status !== 400) {
    throw new Error(
      "O token de recuperação não foi recusado após o primeiro uso."
    );
  }
  const oldLogin = await handler(
    new Request(`${origin}/api/auth/sign-in/email`, {
      body: JSON.stringify({ email: recipient, password: originalPassword }),
      headers: { "Content-Type": "application/json", Origin: origin },
      method: "POST",
    })
  );
  if (oldLogin.status !== 401) {
    throw new Error("A senha anterior não foi recusada após a redefinição.");
  }
  const newLogin = await handler(
    new Request(`${origin}/api/auth/sign-in/email`, {
      body: JSON.stringify({ email: recipient, password: replacementPassword }),
      headers: { "Content-Type": "application/json", Origin: origin },
      method: "POST",
    })
  );
  if (!(newLogin.ok && newLogin.headers.has("set-cookie"))) {
    throw new Error("A nova senha não abriu uma sessão autenticada.");
  }
  return {
    loginWithNewPassword: "passed",
    oldPassword: "rejected",
    passwordReset: "passed",
    resetLink: "confirmed",
    resetTokenReuse: "rejected",
  } as const;
}
