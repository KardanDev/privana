import type { AnalyticsDTO } from "@privana/api/contracts/platform";
import { TableScrollArea } from "@privana/ui/components/table-scroll-area";
import { EmptyState } from "@/shared/components/empty-state";
import { formatMinorCurrency } from "./format-minor-currency";

export function AnalyticsCurrencies({
  currencies,
}: {
  currencies: AnalyticsDTO["currencies"];
}) {
  if (currencies.length === 0) {
    return (
      <EmptyState
        description="O registro financeiro está vazio. Os valores aparecerão quando eventos verificados forem integrados."
        title="Nenhuma transação registrada"
      />
    );
  }
  return (
    <TableScrollArea label="Totais financeiros por moeda">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          Totais financeiros históricos separados por moeda
        </caption>
        <thead className="border-b bg-muted/40 text-muted-foreground text-xs">
          <tr>
            {[
              "Moeda",
              "Recebido",
              "Reembolsado",
              "Pendente",
              "Falhas",
              "Registros",
            ].map((title) => (
              <th
                className="whitespace-nowrap px-4 py-3 font-medium"
                key={title}
                scope="col"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {currencies.map((row) => (
            <tr key={row.currency}>
              <th className="px-4 py-4 font-semibold" scope="row">
                {row.currency}
              </th>
              <td className="whitespace-nowrap px-4 py-4 tabular-nums">
                {formatMinorCurrency(row.receivedMinor, row.currency)}
              </td>
              <td className="whitespace-nowrap px-4 py-4 tabular-nums">
                {formatMinorCurrency(row.refundedMinor, row.currency)}
              </td>
              <td className="whitespace-nowrap px-4 py-4 tabular-nums">
                {formatMinorCurrency(row.pendingMinor, row.currency)}
              </td>
              <td className="whitespace-nowrap px-4 py-4 tabular-nums">
                {formatMinorCurrency(row.failedMinor, row.currency)}
              </td>
              <td className="px-4 py-4 tabular-nums">{row.transactionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScrollArea>
  );
}
