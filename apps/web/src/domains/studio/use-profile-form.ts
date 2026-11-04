"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";
export function useProfileForm() {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    orpc.studio.saveProfile.mutationOptions({
      onError: (error) =>
        toast.error(error.message || "Não foi possível salvar seu perfil."),
      onSuccess: async () => {
        await queryClient.invalidateQueries();
        toast.success("Seu perfil foi salvo.");
      },
    })
  );
  return {
    error: mutation.error?.message,
    onSubmit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (mutation.isPending) {
        return;
      }
      const data = new FormData(event.currentTarget);
      mutation.mutate({
        avatarUrl: String(data.get("avatarUrl") || "") || null,
        bio: String(data.get("bio")),
        category: String(data.get("category")),
        coverUrl: String(data.get("coverUrl") || "") || null,
        displayName: String(data.get("displayName")),
        handle: String(data.get("handle")).trim().toLowerCase(),
        location: String(data.get("location")),
        monthlyPriceCents: Math.round(
          Number(String(data.get("price")).replace(",", ".")) * 100
        ),
      });
    },
    pending: mutation.isPending,
  };
}
