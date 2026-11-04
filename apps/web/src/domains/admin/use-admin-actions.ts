"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { AdminCommand, StatusCommand } from "./admin-types";
import { executeAdminCommand } from "./execute-admin-command";

export function useAdminActions() {
  const queryClient = useQueryClient();
  const [confirmation, setConfirmation] = useState<StatusCommand | null>(null);
  const mutation = useMutation({
    mutationFn: executeAdminCommand,
    onError: () =>
      toast.error("Não foi possível salvar a alteração. Tente novamente."),
    onSuccess: async () => {
      setConfirmation(null);
      toast.success("Alteração salva no histórico de atividade.");
      await queryClient.invalidateQueries();
    },
  });
  return {
    cancel: () => {
      if (!mutation.isPending) {
        setConfirmation(null);
        mutation.reset();
      }
    },
    confirm: () => {
      if (confirmation && !mutation.isPending) {
        mutation.mutate(confirmation);
      }
    },
    confirmation,
    error: mutation.isError,
    onAction: (command: AdminCommand) => {
      if (mutation.isPending) {
        return;
      }
      mutation.reset();
      if (command.kind !== "report" && command.status === "SUSPENDED") {
        setConfirmation(command);
        return;
      }
      mutation.mutate(command);
    },
    pending: mutation.isPending,
  };
}
