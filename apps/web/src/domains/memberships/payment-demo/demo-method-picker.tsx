"use client";

import { cn } from "@privana/ui/lib/utils";
import { CreditCard, QrCode } from "lucide-react";
import { useCallback } from "react";
import type { DemoCurrency, DemoMethod } from "./demo-types";

export function DemoMethodPicker({
  currency,
  method,
  onChange,
}: {
  currency: DemoCurrency;
  method: DemoMethod;
  onChange: (method: DemoMethod) => void;
}) {
  const change = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (value === "card" || value === "pix") {
        onChange(value);
      }
    },
    [onChange]
  );
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 font-semibold text-sm">
        Como você quer testar?
      </legend>
      <label
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg border p-4",
          method === "card" && "border-primary bg-accent/30"
        )}
      >
        <input
          checked={method === "card"}
          className="size-4 accent-primary"
          name="demo-method"
          onChange={change}
          type="radio"
          value="card"
        />
        <CreditCard
          aria-hidden="true"
          className="size-5 text-muted-foreground"
        />
        <span>
          <span className="block font-medium text-sm">Cartão de teste</span>
          <span className="mt-1 block text-muted-foreground text-xs">
            Somente o cartão de exemplo permitido
          </span>
        </span>
      </label>
      <label
        className={cn(
          "flex items-center gap-3 rounded-lg border p-4",
          currency === "BRL"
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50",
          method === "pix" && "border-primary bg-accent/30"
        )}
      >
        <input
          checked={method === "pix"}
          className="size-4 accent-primary"
          disabled={currency !== "BRL"}
          name="demo-method"
          onChange={change}
          type="radio"
          value="pix"
        />
        <QrCode aria-hidden="true" className="size-5 text-muted-foreground" />
        <span>
          <span className="block font-medium text-sm">Pix demonstrativo</span>
          <span className="mt-1 block text-muted-foreground text-xs">
            QR ilustrativo sem valor de pagamento
          </span>
        </span>
      </label>
    </fieldset>
  );
}
