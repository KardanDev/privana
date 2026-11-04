"use client";
import { Button } from "@privana/ui/components/button";
import { CloudOff } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/shared/components/empty-state";
export function QueryFeedback({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const unauthorized =
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "UNAUTHORIZED";
  return (
    <EmptyState
      description={
        unauthorized
          ? "Entre na sua conta para continuar e acompanhar seus criadores favoritos."
          : "Tente novamente em instantes. Seu espaço continua esperando por você."
      }
      icon={CloudOff}
      title={
        unauthorized
          ? "Seu próximo encontro começa aqui"
          : "Não conseguimos carregar agora"
      }
    >
      {unauthorized ? (
        <Button nativeButton={false} render={<Link href="/login" />}>
          Entrar na minha conta
        </Button>
      ) : (
        <Button onClick={retry} variant="outline">
          Tentar novamente
        </Button>
      )}
    </EmptyState>
  );
}
