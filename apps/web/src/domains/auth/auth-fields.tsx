import { AuthField } from "./auth-field";
import type { AuthMode } from "./auth-mode";

export function AuthFields({ mode }: { mode: AuthMode }) {
  const passwordRequired =
    mode === "login" || mode === "register" || mode === "reset";
  return (
    <>
      {mode === "register" ? (
        <AuthField
          autoComplete="name"
          label="Como você quer ser chamado?"
          name="name"
        />
      ) : null}
      {mode === "reset" ? null : (
        <AuthField
          autoComplete="email"
          label="Seu e-mail"
          name="email"
          type="email"
        />
      )}
      {passwordRequired ? (
        <AuthField
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          label={mode === "reset" ? "Nova senha" : "Sua senha"}
          minLength={mode === "login" ? undefined : 12}
          name="password"
          type="password"
        />
      ) : null}
      {mode === "reset" ? (
        <AuthField
          autoComplete="new-password"
          label="Confirme a nova senha"
          minLength={12}
          name="confirmPassword"
          type="password"
        />
      ) : null}
      {mode === "register" ? (
        <p className="text-muted-foreground text-xs leading-relaxed">
          Use pelo menos 12 caracteres. Enviaremos um e-mail para confirmar sua
          conta.
        </p>
      ) : null}
    </>
  );
}
