"use client";

import { Button } from "@privana/ui/components/button";
import { Textarea } from "@privana/ui/components/textarea";
import { useMutation } from "@tanstack/react-query";
import { Flag } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { toast } from "sonner";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { orpc } from "@/utils/orpc";

export function ReportContent({
  postId,
  creatorId,
  expanded = false,
}: {
  postId?: string;
  creatorId?: string;
  expanded?: boolean;
}) {
  const id = useId();
  const [reason, setReason] = useState("");
  const report = useMutation(
    orpc.reports.create.mutationOptions({
      onError: handleActionError,
      onSuccess: () => {
        setReason("");
        toast.success("Sua denúncia foi recebida e será analisada.");
      },
      retry: false,
    })
  );
  const changeReason = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setReason(event.target.value),
    []
  );
  const submitReport = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (
        reason.trim().length >= 10 &&
        !report.isPending &&
        !report.isSuccess
      ) {
        report.mutate({ creatorId, postId, reason: reason.trim() });
      }
    },
    [reason, report, postId, creatorId]
  );
  return (
    <details
      className="text-muted-foreground text-xs"
      open={expanded || undefined}
    >
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-lg p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Flag className="size-3" />
        Denunciar conteúdo
      </summary>
      <form
        className="mt-3 flex flex-col gap-3 rounded-xl border p-4"
        onSubmit={submitReport}
      >
        <label className="font-medium text-foreground text-sm" htmlFor={id}>
          Conte o que aconteceu
        </label>
        <p className="text-xs leading-relaxed">
          Sua denúncia é confidencial. Inclua detalhes para ajudar nossa equipe
          a analisar.
        </p>
        <Textarea
          disabled={report.isPending || report.isSuccess}
          id={id}
          maxLength={2000}
          minLength={10}
          onChange={changeReason}
          required
          value={reason}
        />
        <Button
          aria-busy={report.isPending}
          className="self-start"
          disabled={
            report.isPending || report.isSuccess || reason.trim().length < 10
          }
          type="submit"
          variant="outline"
        >
          {report.isPending ? "Enviando denúncia…" : null}
          {!report.isPending && report.isSuccess ? "Denúncia recebida" : null}
          {report.isPending || report.isSuccess ? null : "Enviar denúncia"}
        </Button>
      </form>
    </details>
  );
}
