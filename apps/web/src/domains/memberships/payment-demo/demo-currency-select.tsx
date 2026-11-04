"use client";

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
      <label className="font-medium text-sm" htmlFor="demo-currency">
        Moeda da demonstração
      </label>
      <select
        className="h-11 min-w-0 rounded-lg border bg-card px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
        id="demo-currency"
        onChange={change}
        value={currency}
      >
        <option value="BRL">BRL · Real brasileiro</option>
        <option value="USD">USD · Dólar americano</option>
        <option value="EUR">EUR · Euro</option>
      </select>
      <p className="text-muted-foreground text-xs">
        A troca de moeda não consulta taxas de câmbio. Pix demonstrativo
        disponível somente em BRL.
      </p>
    </div>
  );
}
