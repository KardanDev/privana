"use client";

import type { OperationsUserDTO } from "@privana/api/contracts/platform";
import { Button } from "@privana/ui/components/button";
import { useTeamRole } from "./use-team-role";

export function TeamRoleForm({
  user,
  viewerId,
}: {
  user: OperationsUserDTO;
  viewerId: string;
}) {
  const state = useTeamRole(user);
  if (user.id === viewerId || user.role === "admin") {
    return <p className="text-muted-foreground text-xs">Conta protegida</p>;
  }
  const eligible = user.emailVerified && user.status === "ACTIVE";
  const editableRole = ["member", "editor", "moderator", "analyst"].includes(
    user.role
  );
  return (
    <div className="flex flex-col gap-2">
      <form
        aria-label={`Papel de ${user.name}`}
        className="flex flex-wrap items-center gap-2"
        onSubmit={state.submit}
      >
        <label className="sr-only" htmlFor={`role-${user.id}`}>
          Papel de {user.name}
        </label>
        <select
          className="h-9 rounded-lg border bg-background px-2 text-xs"
          defaultValue={editableRole ? user.role : ""}
          disabled={!eligible || state.pending}
          id={`role-${user.id}`}
          name="role"
          required
        >
          <option disabled value="">
            Selecionar papel
          </option>
          <option value="member">Membro</option>
          <option value="editor">Editor de conteúdo</option>
          <option value="moderator">Moderador</option>
          <option value="analyst">Analista</option>
        </select>
        <Button
          disabled={!eligible || state.pending}
          size="sm"
          type="submit"
          variant="outline"
        >
          {state.pending ? "Salvando…" : "Salvar papel"}
        </Button>
      </form>
      {eligible ? null : (
        <p className="text-[11px] text-muted-foreground">
          A conta precisa estar ativa e com e-mail verificado para integrar a
          equipe.
        </p>
      )}
      {state.error ? (
        <p className="text-destructive text-xs" role="alert">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
