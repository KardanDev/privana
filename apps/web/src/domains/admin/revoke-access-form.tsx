"use client";

import { Button } from "@privana/ui/components/button";
import { Textarea } from "@privana/ui/components/textarea";
import { useRevokeAccess } from "./use-revoke-access";

export function RevokeAccessForm({ id }: { id: string }) {
  const state = useRevokeAccess(id);
  return (
    <details className="mt-3 rounded-lg border p-3">
      <summary className="cursor-pointer font-medium text-destructive text-xs">
        Revogar acesso local
      </summary>
      <form className="mt-4 flex flex-col gap-3" onSubmit={state.submit}>
        <p className="max-w-lg text-muted-foreground text-xs leading-relaxed">
          Esta ação remove o acesso ao conteúdo e registra o motivo na
          auditoria. Ela não cancela uma cobrança no provedor e não realiza
          reembolso.
        </p>
        <label
          className="flex flex-col gap-2 text-xs"
          htmlFor={`revoke-reason-${id}`}
        >
          Motivo obrigatório
          <Textarea
            disabled={state.pending}
            id={`revoke-reason-${id}`}
            maxLength={1000}
            minLength={10}
            name="reason"
            placeholder="Explique a decisão para a equipe (mínimo de 10 caracteres)."
            required
            rows={3}
          />
        </label>
        <label className="flex items-start gap-2 text-xs">
          <input
            className="mt-0.5 accent-primary"
            disabled={state.pending}
            required
            type="checkbox"
          />
          Confirmo a revogação do acesso a este conteúdo.
        </label>
        {state.error ? (
          <p className="text-destructive text-xs" role="alert">
            {state.error}
          </p>
        ) : null}
        <Button
          className="self-start"
          disabled={state.pending}
          size="sm"
          type="submit"
          variant="destructive"
        >
          {state.pending ? "Revogando…" : "Confirmar revogação de acesso"}
        </Button>
      </form>
    </details>
  );
}
