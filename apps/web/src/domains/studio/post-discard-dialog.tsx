"use client";

import { Button } from "@privana/ui/components/button";
import { useConfirmationDialog } from "@/shared/hooks/use-confirmation-dialog";

export function PostDiscardDialog({
  open,
  pending,
  onCancel,
  onDiscard,
}: {
  open: boolean;
  pending: boolean;
  onCancel: () => void;
  onDiscard: () => void;
}) {
  const dialog = useConfirmationDialog(open, onCancel);
  return (
    <dialog
      aria-describedby="post-discard-description"
      aria-labelledby="post-discard-title"
      className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border bg-card p-6 text-foreground backdrop:bg-foreground/30"
      onCancel={dialog.cancel}
      ref={dialog.ref}
    >
      <h2 className="font-semibold text-xl" id="post-discard-title">
        Descartar suas alterações?
      </h2>
      <p
        className="mt-3 text-base text-muted-foreground leading-relaxed"
        id="post-discard-description"
      >
        As alterações locais desta edição serão perdidas. Continue editando para
        mantê-las.
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button onClick={onCancel}>Continuar editando</Button>
        <Button
          disabled={pending}
          id="discard-post-changes"
          onClick={onDiscard}
          variant="destructive"
        >
          Descartar alterações
        </Button>
      </div>
    </dialog>
  );
}
