"use client";

import { Button } from "@privana/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { orpc } from "@/utils/orpc";
export function InterestButton({ creatorId }: { creatorId: string }) {
  const queryClient = useQueryClient();
  const interest = useMutation(
    orpc.memberships.request.mutationOptions({
      onError: handleActionError,
      onSuccess: async () => {
        toast.success(
          "Interesse registrado. Você será avisado quando as assinaturas chegarem."
        );
        await queryClient.invalidateQueries();
      },
    })
  );
  const requestInterest = useCallback(
    () => interest.mutate({ creatorId }),
    [interest, creatorId]
  );
  return (
    <Button
      disabled={interest.isPending || interest.isSuccess}
      onClick={requestInterest}
    >
      {interest.isSuccess ? (
        <Check data-icon="inline-start" />
      ) : (
        <Bell data-icon="inline-start" />
      )}
      {interest.isSuccess ? "Você está na lista" : "Avise-me no lançamento"}
    </Button>
  );
}
