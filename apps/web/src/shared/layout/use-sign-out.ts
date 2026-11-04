"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const [pending, setPending] = useState(false);
  const signOut = useCallback(async () => {
    setPending(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        throw new Error("Não foi possível sair da conta.");
      }
      window.location.assign("/");
    } catch {
      setPending(false);
      toast.error("Não foi possível sair da conta. Tente novamente.");
    }
  }, []);
  return { pending, signOut };
}
