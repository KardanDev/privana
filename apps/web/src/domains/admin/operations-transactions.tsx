import type { OperationsTransactionDTO } from "@privana/api/contracts/platform";
import { formatDate } from "@/shared/formatting/format-date";
import { AdminStatus } from "./admin-status";
import { formatMinorCurrency } from "./format-minor-currency";

export function OperationsTransactions({
  items,
}: {
  items: OperationsTransactionDTO[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[780px] text-left text-xs">
        <caption className="sr-only">
          Transações verificadas — consulta sem ações de cobrança
        </caption>
        <thead className="border-b bg-muted/40">
          <tr>
            {[
              "Data",
              "Tipo / situação",
              "Valor",
              "Pessoa / criador",
              "Origem",
            ].map((label) => (
              <th className="px-4 py-3 font-medium" key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="whitespace-nowrap px-4 py-4">
                {formatDate(item.occurredAt)}
              </td>
              <td className="px-4 py-4">
                <p className="mb-2">
                  {item.kind === "REFUND" ? "Reembolso" : "Cobrança"}
                </p>
                <AdminStatus status={item.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-4 font-medium tabular-nums">
                {formatMinorCurrency(item.amountMinor, item.currency)}
                <p className="mt-1 font-normal text-muted-foreground">
                  {item.currency}
                </p>
              </td>
              <td className="px-4 py-4">
                <p>{item.userName ?? "Pessoa não vinculada"}</p>
                <p className="mt-1 text-muted-foreground">
                  {item.creatorName ?? "Criador não vinculado"}
                </p>
              </td>
              <td className="max-w-72 px-4 py-4">
                <p>{item.provider}</p>
                <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
                  {item.externalId}
                </p>
                <p className="mt-1 break-all text-[10px] text-muted-foreground">
                  Registro: {item.id}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
