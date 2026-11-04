import type { AnalyticsDTO } from "@privana/api/contracts/platform";

export function AnalyticsSeries({
  daily,
  metric,
  label,
}: {
  daily: AnalyticsDTO["daily"];
  metric: "users" | "posts" | "subscriptions" | "transactions";
  label: string;
}) {
  const maximum = Math.max(1, ...daily.map((day) => day[metric]));
  const total = daily.reduce((sum, day) => sum + day[metric], 0);
  const points = daily
    .map(
      (day, index) =>
        `${(index / Math.max(1, daily.length - 1)) * 300},${75 - (day[metric] / maximum) * 65}`
    )
    .join(" ");
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium text-xs">{label}</h3>
        <span className="font-semibold text-lg tabular-nums">
          {total.toLocaleString("pt-BR")}
        </span>
      </div>
      <svg
        aria-label={`${label}: ${total} no período; evolução por dia em UTC`}
        className="mt-4 h-24 w-full text-primary"
        preserveAspectRatio="none"
        role="img"
        viewBox="0 0 300 80"
      >
        <title>{label}</title>
        <line
          stroke="currentColor"
          strokeOpacity="0.12"
          x1="0"
          x2="300"
          y1="75"
          y2="75"
        />
        <polyline
          fill="none"
          points={points}
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>{daily[0]?.date}</span>
        <span>{daily.at(-1)?.date}</span>
      </div>
    </section>
  );
}
