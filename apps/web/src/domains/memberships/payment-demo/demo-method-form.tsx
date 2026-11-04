"use client";

import { Button } from "@privana/ui/components/button";
import { useCallback, useState } from "react";
import { DemoCardFields } from "./demo-card-fields";
import {
  type DemoMethod,
  TEST_CARD,
  type TestCard,
  type TestCardErrors,
} from "./demo-types";
import { validateTestCard } from "./validate-test-card";

export function DemoMethodForm({
  method,
  onReview,
}: {
  method: DemoMethod;
  onReview: () => void;
}) {
  const [card, setCard] = useState<TestCard>({
    cvc: "",
    expiry: "",
    number: "",
  });
  const [errors, setErrors] = useState<TestCardErrors>({});
  const changeField = useCallback(
    (field: keyof TestCard, value: string) =>
      setCard((current) => ({ ...current, [field]: value })),
    []
  );
  const fillTestData = useCallback(() => {
    setCard({ ...TEST_CARD });
    setErrors({});
  }, []);
  const review = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validation = method === "card" ? validateTestCard(card) : {};
      setErrors(validation);
      const [firstError] = Object.keys(validation);
      if (firstError) {
        event.currentTarget
          .querySelector<HTMLInputElement>(`#demo-card-${firstError}`)
          ?.focus();
        return;
      }
      setCard({ cvc: "", expiry: "", number: "" });
      onReview();
    },
    [card, method, onReview]
  );
  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={review}>
      {method === "card" ? (
        <>
          <div className="rounded-lg bg-muted/60 p-4">
            <p className="text-xs leading-5">
              Cartão: <strong>4242 4242 4242 4242</strong>
              <br />
              Validade: <strong>12/30</strong> · CVC: <strong>123</strong>
            </p>
            <Button
              className="mt-3"
              onClick={fillTestData}
              size="sm"
              type="button"
              variant="outline"
            >
              Preencher dados de teste
            </Button>
          </div>
          <DemoCardFields card={card} errors={errors} onChange={changeField} />
        </>
      ) : (
        <p className="rounded-lg bg-muted/60 p-4 text-sm leading-6">
          Na próxima etapa você poderá gerar um QR meramente ilustrativo e
          testar a confirmação. Não existe chave Pix, boleto ou código pagável
          nesta demonstração.
        </p>
      )}
      <p className="text-muted-foreground text-xs">
        Os campos de teste são apagados ao avançar ou trocar de método/moeda.
      </p>
      <Button className="self-start" type="submit">
        Revisar simulação
      </Button>
    </form>
  );
}
