import { Button } from "@privana/ui/components/button";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";

export function LockedPostPreview({ handle }: { handle: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 border-y bg-muted/40 px-5 py-7 text-center">
      <LockKeyhole aria-hidden="true" className="size-6 text-primary" />
      <p className="font-semibold text-sm">Publicação exclusiva</p>
      <p className="max-w-xs text-muted-foreground text-xs leading-5">
        Conteúdo reservado para membros. As assinaturas estarão disponíveis em
        breve.
      </p>
      <Button
        nativeButton={false}
        render={<Link href={`/creators/${handle}`} />}
        size="sm"
        variant="outline"
      >
        Ver perfil do criador
      </Button>
    </div>
  );
}
