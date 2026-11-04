import type { CreatorDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { InterestButton } from "@/domains/memberships/interest-button";
import { formatCurrency } from "@/shared/formatting/format-currency";

export function MembershipPanel({ creator }: { creator: CreatorDTO }) {
  return (
    <section className="flex flex-col gap-4 border-y bg-muted/30 p-4 sm:p-5 lg:rounded-lg lg:border lg:bg-card">
      <div className="flex items-center gap-2">
        <LockKeyhole aria-hidden="true" className="size-4 text-primary" />
        <h2 className="font-semibold text-sm">Conteúdo para membros</h2>
      </div>
      <p className="text-muted-foreground text-xs leading-5">
        Registre seu interesse para saber quando as assinaturas de{" "}
        {creator.displayName} estiverem disponíveis.
      </p>
      <p className="text-sm">
        <strong className="font-semibold text-xl tabular-nums">
          {formatCurrency(creator.monthlyPriceCents)}
        </strong>
        <span className="text-muted-foreground"> / mês previsto</span>
      </p>
      <InterestButton creatorId={creator.id} />
      <Button
        nativeButton={false}
        render={<Link href={`/checkout/${creator.handle}`} />}
        variant="outline"
      >
        Testar checkout
      </Button>
      <p className="text-[11px] text-muted-foreground leading-4">
        Em breve. Registrar interesse não gera cobrança nem libera conteúdo
        exclusivo.
      </p>
    </section>
  );
}
