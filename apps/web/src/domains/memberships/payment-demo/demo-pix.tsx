"use client";

import { Button } from "@privana/ui/components/button";
import { Copy, QrCode, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { DEMO_PIX_CODE } from "./demo-types";
import { useDemoPixTimer } from "./use-demo-pix-timer";

export function DemoPix({
  onApprove,
  onBack,
}: {
  onApprove: () => void;
  onBack: () => void;
}) {
  const { remaining, restart } = useDemoPixTimer();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DEMO_PIX_CODE);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }, []);
  const regenerate = useCallback(() => {
    restart();
    setCopyState("idle");
  }, [restart]);
  const expired = remaining === 0;
  const timerText = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-semibold text-lg">Pix ilustrativo</h2>
        <p className="mt-2 text-muted-foreground text-sm leading-6">
          Este desenho não contém um QR de pagamento. O código abaixo também não
          é pagável e não possui chave Pix.
        </p>
      </div>
      <figure className="mx-auto flex flex-col items-center gap-3">
        <div className="relative rounded-lg border bg-white p-5 text-black">
          <QrCode aria-hidden="true" className="size-40 opacity-50" />
          <span className="absolute inset-x-5 top-1/2 -translate-y-1/2 bg-white py-2 text-center font-bold text-lg tracking-widest">
            DEMO
          </span>
        </div>
        <figcaption className="text-center text-muted-foreground text-xs">
          Ilustração não escaneável · sem valor financeiro
        </figcaption>
      </figure>
      <p className="text-center text-sm" role="status">
        {expired
          ? "Exemplo expirado. Gere outro para continuar o teste."
          : `Expira em ${timerText} (simulação)`}
      </p>
      <div className="flex flex-col gap-3 rounded-lg bg-muted/60 p-4">
        <p className="font-medium text-xs">
          Código demonstrativo — não pagável
        </p>
        <output className="select-all break-all font-mono text-xs">
          {DEMO_PIX_CODE}
        </output>
        <Button
          className="self-start"
          disabled={expired}
          onClick={copy}
          size="sm"
          variant="outline"
        >
          <Copy data-icon="inline-start" />
          {copyState === "copied"
            ? "Código de exemplo copiado"
            : "Copiar exemplo"}
        </Button>
        {copyState === "failed" ? (
          <p className="text-destructive text-xs" role="status">
            Não foi possível copiar. Selecione o código acima.
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3">
        {expired ? (
          <Button onClick={regenerate}>
            <RotateCcw data-icon="inline-start" />
            Gerar outro exemplo
          </Button>
        ) : (
          <Button onClick={onApprove}>Simular Pix recebido</Button>
        )}
        <Button onClick={onBack} variant="outline">
          Voltar
        </Button>
      </div>
    </section>
  );
}
