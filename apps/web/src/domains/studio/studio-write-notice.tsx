"use client";

import { useIsMutating } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { STUDIO_WRITE_KEY } from "./studio-cache-types";

export function StudioWriteNotice() {
  const pending = useIsMutating({ mutationKey: STUDIO_WRITE_KEY });
  if (!pending) {
    return null;
  }
  return (
    <p
      className="mb-5 flex items-center gap-2 rounded-lg border bg-accent px-4 py-3 text-accent-foreground text-sm"
      role="status"
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-4 shrink-0 animate-spin"
      />
      Sincronizando alterações. Aguarde a confirmação para continuar.
    </p>
  );
}
