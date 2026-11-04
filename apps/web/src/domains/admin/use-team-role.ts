"use client";

import type {
  OperationsUserDTO,
  TeamRole,
} from "@privana/api/contracts/platform";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useCallback } from "react";
import { toast } from "sonner";
import { client } from "@/utils/orpc";

export function useTeamRole(user: OperationsUserDTO) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (role: TeamRole) =>
      client.admin.setTeamRole({ id: user.id, role }),
    onSuccess: async () => {
      toast.success("Papel da equipe atualizado.");
      await queryClient.invalidateQueries({ queryKey: ["admin-operations"] });
    },
  });
  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
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
    [mutation]
  );
  return {
    error: mutation.error?.message,
    pending: mutation.isPending,
    submit,
  };
}
