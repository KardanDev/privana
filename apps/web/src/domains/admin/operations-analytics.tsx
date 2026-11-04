"use client";

import { CreditCard, FileText, Flag, Sparkles, Users } from "lucide-react";
import { QueryFeedback } from "@/shared/components/query-feedback";
import { StatCard } from "@/shared/components/stat-card";
import { AnalyticsCurrencies } from "./analytics-currencies";
import { AnalyticsSeries } from "./analytics-series";
import { useOperationsAnalytics } from "./use-operations-analytics";

export function OperationsAnalytics() {
  const { query, days, changeDays } = useOperationsAnalytics();
  if (query.isPending) {
    return <QueryFeedback loading />;
  }
  if (query.isError) {
    return <QueryFeedback retry={query.refetch} />;
  }
  const { totals, daily, currencies } = query.data;
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard icon={Users} label="Pessoas" value={totals.users} />
        <StatCard
          detail={`${totals.pendingCreators} aguardando análise`}
          icon={Sparkles}
          label="Criadores"
          value={totals.creators}
        />
        <StatCard
          icon={FileText}
          label="Publicações publicadas"
          value={totals.posts}
        />
        <StatCard
          icon={CreditCard}
          label="Assinaturas ativas"
          value={totals.activeSubscriptions}
        />
        <StatCard
          icon={Flag}
          label="Denúncias abertas"
          value={totals.openReports}
        />
        <StatCard
          icon={Sparkles}
          label="Perfis em análise"
          value={totals.pendingCreators}
        />
      </div>
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-base">Atividade da comunidade</h2>
            <p className="mt-1 text-muted-foreground text-xs">
              Novos registros por dia. Datas em UTC.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs">
            Período
            <select
              className="h-9 rounded-lg border bg-card px-3"
              onChange={changeDays}
              value={days}
            >
              <option value="7">7 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <AnalyticsSeries
            daily={daily}
            label="Pessoas cadastradas"
            metric="users"
          />
          <AnalyticsSeries
            daily={daily}
            label="Publicações criadas"
            metric="posts"
          />
          <AnalyticsSeries
            daily={daily}
            label="Assinaturas registradas"
            metric="subscriptions"
          />
          <AnalyticsSeries
            daily={daily}
            label="Transações registradas"
            metric="transactions"
          />
        </div>
        <details className="rounded-xl border bg-card p-4 text-xs">
          <summary className="cursor-pointer font-medium">
            Ver valores diários
          </summary>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  {[
                    "Data UTC",
                    "Pessoas",
                    "Posts",
                    "Assinaturas",
                    "Transações",
                  ].map((heading) => (
                    <th className="p-2 font-medium" key={heading} scope="col">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daily.map((day) => (
                  <tr className="border-t" key={day.date}>
                    <th className="p-2 font-normal" scope="row">
                      {day.date}
                    </th>
                    <td className="p-2">{day.users}</td>
                    <td className="p-2">{day.posts}</td>
                    <td className="p-2">{day.subscriptions}</td>
                    <td className="p-2">{day.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold text-base">
            Registro financeiro por moeda
          </h2>
          <p className="mt-1 text-muted-foreground text-xs">
            Totais históricos. Moedas permanecem separadas; pagamentos ao vivo
            ainda não estão integrados.
          </p>
        </div>
        <AnalyticsCurrencies currencies={currencies} />
      </section>
    </div>
  );
}
