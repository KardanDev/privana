"use client";

import { UserRoundX } from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { usePlatform } from "@/shared/platform/use-platform";

export function CreatorApplicationClosed() {
  const config = usePlatform();
  return (
    <EmptyState
      description="A plataforma não está recebendo novos perfis de criador neste momento. Você pode continuar acompanhando os criadores e usando sua conta."
      icon={UserRoundX}
      title="Candidaturas de criadores encerradas"
    >
      {config.footer.supportEmail ? (
        <a
          className="font-medium text-primary text-sm underline underline-offset-4"
          href={`mailto:${config.footer.supportEmail}`}
        >
          Falar com o suporte
        </a>
      ) : null}
    </EmptyState>
  );
}
