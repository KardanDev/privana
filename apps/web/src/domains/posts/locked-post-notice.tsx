import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";

export function LockedPostNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 border-y bg-muted/40 px-5 py-7 text-center">
      <LockKeyhole aria-hidden="true" className="size-6 text-primary" />
      <p className="font-semibold text-base">Publicação exclusiva</p>
      <p className="max-w-xs text-muted-foreground text-sm leading-5">
        Conteúdo reservado para membros. As assinaturas estarão disponíveis em
        breve.
      </p>
      {children}
    </div>
  );
}
