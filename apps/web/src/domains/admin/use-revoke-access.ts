"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useCallback } from "react";
import { toast } from "sonner";
import { client } from "@/utils/orpc";

export function useRevokeAccess(id: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (reason: string) =>
      client.admin.revokeSubscription({ id, reason }),
    onSuccess: async () => {
      toast.success("Acesso local revogado. Nenhuma cobrança foi alterada.");
      await queryClient.invalidateQueries();
    },
  });
  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      mutation.mutate(
        String(new FormData(event.currentTarget).get("reason") ?? "").trim()
      );
    },
    [mutation]
  );
  return {
    error: mutation.error?.message,
    pending: mutation.isPending,
    submit,
  };
}
