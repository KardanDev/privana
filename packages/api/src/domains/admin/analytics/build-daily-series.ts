import type { AnalyticsDTO } from "../../../contracts/platform";
export interface DailyAggregateRow {
  count: number;
  date: string;
  kind: "users" | "posts" | "subscriptions" | "transactions";
}
export function buildDailySeries(
  rows: DailyAggregateRow[],
  days: number,
  now: Date
): AnalyticsDTO["daily"] {
  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - days + 1
    )
  );
  const daily = new Map<string, AnalyticsDTO["daily"][number]>();
  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(start.getTime() + offset * 86_400_000)
      .toISOString()
      .slice(0, 10);
    daily.set(date, {
      date,
      posts: 0,
      subscriptions: 0,
      transactions: 0,
      users: 0,
    });
  }
  for (const row of rows) {
    const day = daily.get(row.date);
    if (day) {
      day[row.kind] += row.count;
    }
  }
  return [...daily.values()];
}
