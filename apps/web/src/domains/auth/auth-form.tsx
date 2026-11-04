"use client";

import { Button } from "@privana/ui/components/button";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Brand } from "@/shared/components/brand";
import { usePlatform } from "@/shared/platform/use-platform";
import { authCopy } from "./auth-copy";
import { AuthFields } from "./auth-fields";
import type { AuthMode } from "./auth-mode";
import { submitAuth } from "./submit-auth";

export function AuthForm({
  mode,
  token,
  initialMessage,
  invalidLink = false,
}: {
  mode: AuthMode;
  token?: string;
  initialMessage?: string;
  invalidLink?: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const config = usePlatform();
  const [state, action, pending] = useActionState(
    async (_previous: { error?: string; success?: string }, form: FormData) => {
      try {
        const result = await submitAuth(mode, form, token);
        if (result.redirect) {
          queryClient.clear();
          router.push(result.redirect);
          router.refresh();
        }
        return result;
      } catch {
        return {
          error:
            "Não foi possível conectar. Verifique sua conexão e tente novamente.",
        };
      }
    },
    {}
  );
  const copy = authCopy[mode];
  const completedReset = mode === "reset" && Boolean(state.success);
  const registrationClosed =
    mode === "register" && !config.features.registration;
  return (
    <section className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="bg-card p-5 sm:rounded-xl sm:border sm:p-8">
        <div className="mb-9">
          <Brand />
        </div>
        <h1 className="font-semibold text-2xl tracking-tight">
          {mode === "login" ? config.auth.title : copy.title}
        </h1>
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
          {mode === "login" ? config.auth.description : copy.description}
        </p>
        {initialMessage ? (
          <p className="mt-5 rounded-xl bg-secondary p-4 text-sm" role="status">
            {initialMessage}
          </p>
        ) : null}
        {invalidLink ? (
          <p className="mt-5 text-destructive text-sm" role="alert">
            Este link é inválido ou expirou.{" "}
            <Link
              className="underline"
              href={mode === "reset" ? "/forgot-password" : "/verify-email"}
            >
              Solicite outro link.
            </Link>
          </p>
        ) : null}
        {registrationClosed ? (
          <p className="mt-5 rounded-lg border p-4 text-sm" role="status">
            Novos cadastros estão temporariamente fechados. Contas existentes
            podem continuar entrando.
          </p>
        ) : null}
        <form action={action} className="mt-7 flex flex-col gap-5">
          <fieldset
            className="flex min-w-0 flex-col gap-5"
            disabled={
              pending || completedReset || invalidLink || registrationClosed
            }
          >
            <legend className="sr-only">{copy.title}</legend>
            <AuthFields mode={mode} />
            <Button
              className="h-12 w-full rounded-xl"
              disabled={
                pending || completedReset || invalidLink || registrationClosed
              }
              type="submit"
            >
              {pending ? "Aguarde um instante…" : copy.submit}
            </Button>
          </fieldset>
          {state.error ? (
            <p className="text-destructive text-sm" role="alert">
              {state.error}
            </p>
          ) : null}
          {state.success ? (
            <p className="rounded-xl bg-secondary p-4 text-sm" role="status">
              {state.success}
            </p>
          ) : null}
        </form>
        <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm">
          {mode === "login" ? (
            <>
              <Link
                className="text-muted-foreground hover:text-primary"
                href="/forgot-password"
              >
                Esqueci minha senha
              </Link>
              <Link
                className="text-muted-foreground hover:text-primary"
                href="/verify-email"
              >
                Preciso confirmar meu e-mail
              </Link>
              {config.features.registration ? (
                <p className="mt-3 text-muted-foreground">
                  Ainda não faz parte?{" "}
                  <Link className="font-medium text-primary" href="/register">
                    Crie sua conta
                  </Link>
                </p>
              ) : null}
            </>
          ) : (
            <Link className="font-medium text-primary" href="/login">
              {mode === "register"
                ? "Já tenho uma conta. Entrar"
                : "Voltar para entrar"}
            </Link>
          )}
        </div>
      </div>
      <p className="mt-6 text-center text-muted-foreground text-xs">
        {config.brand.tagline}
      </p>
    </section>
  );
}
