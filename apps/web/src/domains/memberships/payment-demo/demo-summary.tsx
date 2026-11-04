import { Avatar } from "@/shared/components/avatar";
import type { DemoCreator, DemoCurrency, DemoMethod } from "./demo-types";
import { formatDemoCurrency } from "./format-demo-currency";
import { getDemoPrice } from "./get-demo-price";

export function DemoSummary({
  creator,
  currency,
  method,
}: {
  creator: DemoCreator;
  currency: DemoCurrency;
  method: DemoMethod;
}) {
  return (
    <aside className="h-fit rounded-lg border bg-card p-5">
      <h2 className="mb-5 font-semibold text-sm">Resumo da simulação</h2>
      <div className="flex items-center gap-3">
        <Avatar name={creator.name} size={48} src={creator.avatarUrl} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-sm">{creator.name}</p>
          <p className="text-muted-foreground text-xs">
            {creator.sample
              ? "Perfil fictício de demonstração"
              : `@${creator.handle}`}
          </p>
        </div>
      </div>
      <dl className="mt-6 flex flex-col gap-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Plano de exemplo</dt>
          <dd>1 mês</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Método</dt>
          <dd>{method === "card" ? "Cartão de teste" : "Pix ilustrativo"}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t pt-4">
          <dt className="font-semibold">Total demonstrativo</dt>
          <dd className="font-semibold tabular-nums">
            {formatDemoCurrency(
              getDemoPrice(creator.priceCents, currency),
              currency
            )}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Cobrança real</dt>
          <dd className="tabular-nums">{formatDemoCurrency(0, currency)}</dd>
        </div>
      </dl>
      <p className="mt-5 text-muted-foreground text-xs leading-5">
        Os valores são exemplos. USD e EUR usam preços ilustrativos
        independentes, sem conversão cambial. Não há assinatura, renovação
        automática ou pagamento real.
      </p>
    </aside>
  );
}
