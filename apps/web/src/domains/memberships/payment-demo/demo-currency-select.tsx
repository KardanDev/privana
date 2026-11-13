"use client";

import { Label } from "@privana/ui/components/label";
import { NativeSelect } from "@privana/ui/components/native-select";
import { useCallback } from "react";
import type { DemoCurrency } from "./demo-types";

export function DemoCurrencySelect({
  currency,
  onChange,
}: {
  currency: DemoCurrency;
  onChange: (currency: DemoCurrency) => void;
}) {
  const change = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      if (value === "BRL" || value === "USD" || value === "EUR") {
        onChange(value);
      }
    },
    [onChange]
  );
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="demo-currency">Moeda da demonstração</Label>
      <NativeSelect
        aria-describedby="demo-currency-hint"
        id="demo-currency"
        onChange={change}
        value={currency}
      >
        <option value="BRL">BRL · Real brasileiro</option>
        <option value="USD">USD · Dólar americano</option>
        <option value="EUR">EUR · Euro</option>
      </NativeSelect>
      <p className="text-muted-foreground text-sm" id="demo-currency-hint">
        A troca de moeda não consulta taxas de câmbio. Pix demonstrativo
        disponível somente em BRL.
      </p>
    </div>
  );
}
