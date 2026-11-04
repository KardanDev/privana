"use client";

import { Button } from "@privana/ui/components/button";
import { ShieldAlert } from "lucide-react";
import type { StatusCommand } from "./admin-types";
import { useConfirmationDialog } from "./use-confirmation-dialog";

export function AdminConfirmation({
  command,
  onCancel,
  onConfirm,
  pending,
  error,
}: {
  command: StatusCommand | null;
  onCancel: () => void;
  onConfirm: () => void;
  pending: boolean;
  error: boolean;
}) {
  const dialog = useConfirmationDialog(command !== null, onCancel);
  return (
    <dialog
      aria-describedby="admin-confirm-description"
      aria-labelledby="admin-confirm-title"
      className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border bg-card p-6 text-foreground shadow-xl backdrop:bg-foreground/30"
      onCancel={dialog.cancel}
      ref={dialog.ref}
    >
      <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <ShieldAlert aria-hidden="true" className="size-5" />
      </span>
      <h2 className="font-semibold text-xl" id="admin-confirm-title">
        Confirmar suspensão
      </h2>
      <p
        className="mt-3 break-words text-muted-foreground text-sm leading-relaxed"
        id="admin-confirm-description"
      >
        {command?.kind === "creator" ? (
          <>
            O perfil de{" "}
            <strong className="text-foreground">{command.name}</strong> será
            ocultado das áreas públicas. Você poderá reativá-lo depois.
          </>
        ) : (
          <>
            A conta de{" "}
            <strong className="text-foreground">{command?.name}</strong> perderá
            acesso e suas sessões serão encerradas. Você poderá reativá-la
            depois.
          </>
        )}
      </p>
      {error ? (
        <p className="mt-4 text-destructive text-sm" role="alert">
          A suspensão não foi salva. Tente novamente.
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button disabled={pending} onClick={onCancel} variant="outline">
          Cancelar
        </Button>
        <Button disabled={pending} onClick={onConfirm} variant="destructive">
          {pending ? "Suspendendo…" : "Confirmar suspensão"}
        </Button>
      </div>
    </dialog>
  );
}
