"use client";

import { Clock3, ShieldAlert } from "lucide-react";
import { usePlatform } from "@/shared/platform/use-platform";

export function StudioStatusNotice({ status }: { status: string }) {
  const config = usePlatform();
  if (status === "ACTIVE") {
    return null;
  }
  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4"
      role="status"
    >
      {status === "PENDING" ? (
        <Clock3
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-muted-foreground"
        />
      ) : (
        <ShieldAlert
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-muted-foreground"
        />
      )}
      <div>
        <h2 className="font-semibold text-sm">
          {status === "PENDING" ? "Perfil em análise" : "Perfil suspenso"}
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          {status === "PENDING"
            ? "Sua candidatura foi recebida. Você pode atualizar o perfil enquanto aguarda a aprovação para publicar."
            : "Entre em contato com a equipe para revisar a situação do seu perfil."}
        </p>
        {config.footer.supportEmail ? (
          <a
            className="mt-3 inline-block font-medium text-primary text-sm underline underline-offset-4"
            href={`mailto:${config.footer.supportEmail}`}
          >
            Falar com o suporte
          </a>
        ) : null}
      </div>
    </div>
  );
}
