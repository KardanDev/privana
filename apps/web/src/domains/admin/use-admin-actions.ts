"use client";

import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { AdminCommand, StatusCommand } from "./admin-types";
import { executeAdminCommand } from "./execute-admin-command";
import { optimisticOperation } from "./optimistic-operation";
import { refreshOperations } from "./refresh-operations";
import { rollbackOperation } from "./rollback-operation";

const commandSections = {
  creator: "creators",
  report: "reports",
  user: "users",
} as const;

export function useAdminActions() {
  const queryClient = useQueryClient();
  const pendingWrites = useIsMutating({ mutationKey: ["admin-write"] });
  const [confirmation, setConfirmation] = useState<StatusCommand | null>(null);
  const mutation = useMutation<
    Awaited<ReturnType<typeof executeAdminCommand>>,
    Error,
    AdminCommand,
    Awaited<ReturnType<typeof optimisticOperation>>
  >({
    mutationFn: executeAdminCommand,
    mutationKey: ["admin-write", "status"],
    onError: (_error, _command, rollback) => {
      rollbackOperation(queryClient, rollback);
      toast.error("A alteração foi desfeita. Não foi possível salvar.");
    },
    onMutate: async (command) =>
      await optimisticOperation(queryClient, {
        field: "status",
        id: command.id,
        section: commandSections[command.kind],
        value: command.status,
      }),
    onSettled: async (_data, _error, command) =>
      await refreshOperations(queryClient, command.kind !== "report"),
    onSuccess: () => {
      setConfirmation(null);
      toast.success("Alteração salva no histórico de atividade.");
    },
    retry: false,
  });
  return {
    cancel: () => {
      if (!mutation.isPending) {
        setConfirmation(null);
        mutation.reset();
      }
    },
    confirm: () => {
      if (
        confirmation &&
        queryClient.isMutating({ mutationKey: ["admin-write"] }) === 0
      ) {
        mutation.mutate(confirmation);
      }
    },
    confirmation,
    error: mutation.isError,
    onAction: (command: AdminCommand) => {
      if (queryClient.isMutating({ mutationKey: ["admin-write"] }) > 0) {
        return;
      }
      mutation.reset();
      if (command.kind !== "report" && command.status === "SUSPENDED") {
        setConfirmation(command);
        return;
      }
      mutation.mutate(command);
    },
    pending: pendingWrites > 0,
  };
}
