"use client";

import type {
  OperationsUserDTO,
  TeamRole,
} from "@privana/api/contracts/platform";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { type FormEvent, useCallback } from "react";
import { toast } from "sonner";
import { client } from "@/utils/orpc";
import { optimisticOperation } from "./optimistic-operation";
import { refreshOperations } from "./refresh-operations";
import { rollbackOperation } from "./rollback-operation";

export function useTeamRole(user: OperationsUserDTO) {
  const queryClient = useQueryClient();
  const pendingWrites = useIsMutating({ mutationKey: ["admin-write"] });
  const mutation = useMutation<
    Awaited<ReturnType<typeof client.admin.setTeamRole>>,
    Error,
    TeamRole,
    Awaited<ReturnType<typeof optimisticOperation>>
  >({
    mutationFn: (role: TeamRole) =>
      client.admin.setTeamRole({ id: user.id, role }),
    mutationKey: ["admin-write", "role", user.id],
    onError: (_error, _role, rollback) =>
      rollbackOperation(queryClient, rollback),
    onMutate: async (role) =>
      await optimisticOperation(queryClient, {
        field: "role",
        id: user.id,
        section: "users",
        value: role,
      }),
    onSettled: async () => await refreshOperations(queryClient),
    onSuccess: () => {
      toast.success("Papel da equipe atualizado.");
    },
    retry: false,
  });
  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (queryClient.isMutating({ mutationKey: ["admin-write"] }) > 0) {
        return;
      }
      const role = new FormData(event.currentTarget).get("role");
      if (
        role === "member" ||
        role === "editor" ||
        role === "moderator" ||
        role === "analyst"
      ) {
        mutation.mutate(role);
      }
    },
    [mutation, queryClient]
  );
  return {
    error: mutation.error?.message,
    pending: pendingWrites > 0,
    submit,
  };
}
