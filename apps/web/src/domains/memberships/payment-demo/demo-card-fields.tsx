"use client";

import { Input } from "@privana/ui/components/input";
import { useCallback } from "react";
import type { TestCard, TestCardErrors } from "./demo-types";

export function DemoCardFields({
  card,
  errors,
  onChange,
}: {
  card: TestCard;
  errors: TestCardErrors;
  onChange: (field: keyof TestCard, value: string) => void;
}) {
  const changeNumber = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange("number", event.target.value),
    [onChange]
  );
  const changeExpiry = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange("expiry", event.target.value),
    [onChange]
  );
  const changeCvc = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange("cvc", event.target.value),
    [onChange]
  );
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-3 font-semibold text-sm">
        Dados de teste — não use um cartão real
      </legend>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm" htmlFor="demo-card-number">
          Número de teste
        </label>
        <Input
          aria-describedby="demo-card-number-error"
          aria-invalid={Boolean(errors.number)}
          autoComplete="off"
          id="demo-card-number"
          inputMode="numeric"
          maxLength={19}
          onChange={changeNumber}
          placeholder="4242 4242 4242 4242"
          value={card.number}
        />
        <p className="text-destructive text-xs" id="demo-card-number-error">
          {errors.number}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm" htmlFor="demo-card-expiry">
            Validade de teste
          </label>
          <Input
            aria-describedby="demo-card-expiry-error"
            aria-invalid={Boolean(errors.expiry)}
            autoComplete="off"
            id="demo-card-expiry"
            inputMode="numeric"
            maxLength={5}
            onChange={changeExpiry}
            placeholder="12/30"
            value={card.expiry}
          />
          <p className="text-destructive text-xs" id="demo-card-expiry-error">
            {errors.expiry}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm" htmlFor="demo-card-cvc">
            CVC de teste
          </label>
          <Input
            aria-describedby="demo-card-cvc-error"
            aria-invalid={Boolean(errors.cvc)}
            autoComplete="off"
            id="demo-card-cvc"
            inputMode="numeric"
            maxLength={3}
            onChange={changeCvc}
            placeholder="123"
            value={card.cvc}
          />
          <p className="text-destructive text-xs" id="demo-card-cvc-error">
            {errors.cvc}
          </p>
        </div>
      </div>
    </fieldset>
  );
}
