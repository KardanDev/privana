"use client";

import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { type FormEvent, useCallback } from "react";
import { toast } from "sonner";
import { client } from "@/utils/orpc";
import { refreshOperations } from "./refresh-operations";

export function useRevokeAccess(id: string) {
  const queryClient = useQueryClient();
  const pendingWrites = useIsMutating({ mutationKey: ["admin-write"] });
  const mutation = useMutation({
    mutationFn: (reason: string) =>
      client.admin.revokeSubscription({ id, reason }),
    mutationKey: ["admin-write", "revoke", id],
    onSuccess: async () => {
      toast.success("Acesso local revogado. Nenhuma cobrança foi alterada.");
      await refreshOperations(queryClient, true);
    },
    retry: false,
  });
  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (queryClient.isMutating({ mutationKey: ["admin-write"] }) > 0) {
        return;
      }
      mutation.mutate(
        String(new FormData(event.currentTarget).get("reason") ?? "").trim()
      );
    },
    [mutation, queryClient]
  );
  return {
    error: mutation.error?.message,
    pending: pendingWrites > 0,
    submit,
  };
}
