import { Button } from "@privana/ui/components/button";
import { CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";
import type { DemoCreator, DemoResult } from "./demo-types";

export function DemoOutcome({
  result,
  creator,
  onReset,
}: {
  result: DemoResult;
  creator: DemoCreator;
  onReset: () => void;
}) {
  const approved = result.status === "approved";
  return (
    <section className="flex flex-col items-start gap-5" role="status">
      {approved ? (
        <CircleCheck aria-hidden="true" className="size-10 text-primary" />
      ) : (
        <CircleX aria-hidden="true" className="size-10 text-muted-foreground" />
      )}
      <div>
        <h2 className="font-semibold text-xl">
          {approved ? "Simulação aprovada" : "Recusa simulada"}
        </h2>
        <p className="mt-3 text-muted-foreground text-sm leading-6">
          {approved
            ? "O fluxo de exemplo terminou. Não houve pagamento, nenhuma assinatura foi criada e seu acesso a conteúdo exclusivo continua igual."
            : "Você testou uma recusa. Não houve cobrança ou alteração de assinatura. Reinicie para experimentar outro caminho."}
        </p>
      </div>
      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
        <strong>Somente demonstração.</strong> Nenhum recibo, transação
        financeira ou crédito foi gerado.
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onReset}>Testar novamente</Button>
        <Button
          nativeButton={false}
          render={
            <Link
              href={creator.sample ? "/explore" : `/creators/${creator.handle}`}
            />
          }
          variant="outline"
        >
          {creator.sample ? "Explorar criadores" : "Voltar ao perfil"}
        </Button>
      </div>
    </section>
  );
}
