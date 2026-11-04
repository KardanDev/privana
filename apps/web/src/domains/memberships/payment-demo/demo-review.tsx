import { Button } from "@privana/ui/components/button";
import type { DemoCurrency, DemoMethod } from "./demo-types";

export function DemoReview({
  method,
  currency,
  onApprove,
  onDecline,
  onPix,
  onBack,
}: {
  method: DemoMethod;
  currency: DemoCurrency;
  onApprove: () => void;
  onDecline: () => void;
  onPix: () => void;
  onBack: () => void;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-semibold text-lg">Revise a demonstração</h2>
        <p className="mt-2 text-muted-foreground text-sm leading-6">
          Esta etapa testa a experiência de pagamento. Nenhum dado será enviado
          a um processador e nenhuma assinatura será ativada.
        </p>
      </div>
      <dl className="flex flex-col gap-3 rounded-lg border p-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Método de teste</dt>
          <dd>
            {method === "card" ? "Cartão de teste · 4242" : "Pix não pagável"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Moeda do exemplo</dt>
          <dd>{currency}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Cobrança e renovação</dt>
          <dd>Nenhuma</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        {method === "card" ? (
          <>
            <Button onClick={onApprove}>Simular aprovação</Button>
            <Button onClick={onDecline} variant="outline">
              Simular recusa
            </Button>
          </>
        ) : (
          <Button onClick={onPix}>Gerar Pix de demonstração</Button>
        )}
        <Button onClick={onBack} variant="ghost">
          Voltar
        </Button>
      </div>
    </section>
  );
}
