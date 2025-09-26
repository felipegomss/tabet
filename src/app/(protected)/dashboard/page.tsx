import { BalanceChart } from "@/components/dashboard/balance-chart";
import { BetsTable } from "@/components/dashboard/bets-table";
import { CardsStats } from "@/components/dashboard/cards-stats";
import { ChartLineInteractive } from "@/components/dashboard/chart-line-interactive";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1) Linha diária (90d)
  const { data: daily } = await supabase
    .from("bets_daily_summary")
    .select("*")
    .eq("user_id", user.id)
    .order("day", { ascending: true });

  // 2) Mini cards
  const [accuracy, avgStake] = await Promise.all([
    supabase
      .from("bets_daily_accuracy")
      .select("*")
      .eq("user_id", user.id)
      .order("day", { ascending: true }),
    supabase
      .from("bets_daily_avg_stake")
      .select("*")
      .eq("user_id", user.id)
      .order("day", { ascending: true }),
  ]);

  // 3) Tabelas
  const [today, month, last30] = await Promise.all([
    supabase
      .from("bets_today")
      .select("*")
      .eq("user_id", user.id)
      .order("event_at", { ascending: false }),
    supabase
      .from("bets_current_month")
      .select("*")
      .eq("user_id", user.id)
      .order("event_at", { ascending: false }),
    supabase
      .from("bets_last_30_days")
      .select("*")
      .eq("user_id", user.id)
      .order("event_at", { ascending: false }),
  ]);

  // 4) Balanço acumulado (90d)
  const { data: balance } = await supabase
    .from("bets_balance_last_90_days")
    .select("*")
    .eq("user_id", user.id)
    .order("day", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <BalanceChart balance={balance ?? []} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2 flex flex-col">
          <ChartLineInteractive data={daily ?? []} />
        </div>

        <CardsStats
          accuracy={(accuracy.data ?? []).map((d) => ({
            date: d.day,
            value: Number(d.accuracy ?? 0),
          }))}
          avgStake={(avgStake.data ?? []).map((d) => ({
            date: d.day,
            value: Number(d.avg_stake ?? 0),
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
