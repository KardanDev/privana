import { authClient } from "@/lib/auth-client";
import { authError } from "./auth-error";
import type { AuthMode } from "./auth-mode";

export async function submitAuth(
  mode: AuthMode,
  form: FormData,
  token?: string
): Promise<{
  error?: string;
  success?: string;
  redirect?: "/feed" | "/verify-email";
}> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const { origin } = window.location;
  if (mode === "login") {
    const result = await authClient.signIn.email({ email, password });
    return result.error
      ? { error: authError(result.error) }
      : { redirect: "/feed" };
  }
  if (mode === "register") {
    const result = await authClient.signUp.email({
      callbackURL: `${origin}/login?verified=1`,
      email,
      name: String(form.get("name") ?? "").trim(),
      password,
    });
    return result.error
      ? { error: authError(result.error) }
      : { redirect: "/verify-email" };
  }
  if (mode === "forgot") {
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: `${origin}/reset-password`,
    });
    return result.error
      ? { error: authError(result.error) }
      : {
          success:
            "Se este e-mail possui uma conta, você receberá as instruções para redefinir sua senha.",
        };
  }
  if (mode === "verify") {
    const result = await authClient.sendVerificationEmail({
      callbackURL: `${origin}/login?verified=1`,
      email,
    });
    return result.error
      ? { error: authError(result.error) }
      : {
          success:
            "Se a conta precisar de confirmação, você receberá um novo link. Confira também a pasta de spam.",
        };
  }
  if (!token) {
    return {
      error: "O link está incompleto. Solicite uma nova recuperação de senha.",
    };
  }
  if (password !== form.get("confirmPassword")) {
    return { error: "As senhas precisam ser iguais." };
  }
  const result = await authClient.resetPassword({
    newPassword: password,
    token,
  });
  return result.error
    ? { error: authError(result.error) }
    : { success: "Senha atualizada. Entre na sua conta com a nova senha." };
}
