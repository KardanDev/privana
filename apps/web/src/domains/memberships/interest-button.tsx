"use client";

import { Button } from "@privana/ui/components/button";
import { Bell, Check } from "lucide-react";
import { useMembershipInterest } from "./use-membership-interest";
export function InterestButton({ creatorId }: { creatorId: string }) {
  const interest = useMembershipInterest(creatorId);
  return (
    <Button
      aria-busy={interest.pending}
      disabled={interest.pending || interest.registered}
      onClick={interest.request}
    >
      {interest.registered && !interest.pending ? (
        <Check data-icon="inline-start" />
      ) : (
        <Bell data-icon="inline-start" />
      )}
      {interest.pending ? "Registrando interesse…" : null}
      {!interest.pending && interest.registered ? "Você está na lista" : null}
      {interest.pending || interest.registered
        ? null
        : "Avise-me no lançamento"}
    </Button>
  );
}
