// app/dashboard/page.tsx
import { BalanceChart } from "@/components/dashboard/balance-chart";
import { BetsTable } from "@/components/dashboard/bets-table";
import { CardsStats } from "@/components/dashboard/cards-stats";
import { ChartLineInteractive } from "@/components/dashboard/chart-line-interactive";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: daily } = await supabase
    .from("bets_daily_summary")
    .select("*")
    .order("date", { ascending: true });

  const [accuracy, avgStake] = await Promise.all([
    supabase.from("bets_daily_accuracy").select("*").order("dia"),
    supabase.from("bets_daily_avg_stake").select("*").order("dia"),
  ]);

  const [today, month, last30] = await Promise.all([
    supabase
      .from("bets_today")
      .select("*")
      .order("event_at", { ascending: false }),
    supabase
      .from("bets_current_month")
      .select("*")
      .order("event_at", { ascending: false }),
    supabase
      .from("bets_last_30_days")
      .select("*")
      .order("event_at", { ascending: false }),
  ]);

  const { data: balance } = await supabase
    .from("bets_balance_last_100_days")
    .select("*")
    .order("dia", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <BalanceChart balance={balance ?? []} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2 flex flex-col">
          <ChartLineInteractive data={daily ?? []} />
        </div>

        <CardsStats
          accuracy={(accuracy.data ?? []).map((d) => ({
            date: d.dia,
            value: d.accuracy,
          }))}
          avgStake={(avgStake.data ?? []).map((d) => ({
            date: d.dia,
            value: d.avg_stake,
          }))}
        />
      </div>

      <BetsTable
        betsToday={today.data ?? []}
        betsMonth={month.data ?? []}
        betsLast30={last30.data ?? []}
      />
    </div>
  );
}
