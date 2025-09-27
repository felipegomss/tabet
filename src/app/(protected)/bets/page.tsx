import { BetsDataTable } from "@/components/bets-datatable";
import { createClient } from "@/utils/supabase/server";

type Props = {
  searchParams: Promise<{
    page?: string;
    result?: string;
    title?: string;
    date?: string;
  }>;
};

export default async function BetsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();

  const pageSize = 12;
  const pageIndex = Number(resolvedSearchParams.page ?? 0);
  const filterResult = resolvedSearchParams.result;
  const search = resolvedSearchParams.title;
  const date = resolvedSearchParams.date ?? undefined;

  let query = supabase
    .from("bets_list_paged")
    .select("*", { count: "exact" })
    .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)
    .order("event_date", { ascending: false })
    .order("title_normalized", { ascending: true })
    .order("market_normalized", { ascending: true })
    .order("house", { ascending: true })
    .order("event_at", { ascending: false });

  if (search) {
    const wildcardSearch = `%${search}%`;
    query = query.or(
      `title.ilike.${wildcardSearch},market.ilike.${wildcardSearch}`
    );
  }
  if (filterResult) query = query.eq("result", filterResult);
  if (date) {
    const startDate = new Date(`${date}T00:00:00`);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    query = query
      .gte("event_at", startDate.toISOString())
      .lt("event_at", endDate.toISOString());
  }

  const { data, count } = await query;

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Minhas Apostas
        </h1>
        <p className="text-muted-foreground">
          Consulte e filtre todas as apostas registradas na plataforma.
        </p>
      </header>

      <BetsDataTable
        data={data ?? []}
        total={count ?? 0}
        pageSize={pageSize}
        pageIndex={pageIndex}
        filterResult={filterResult}
        search={search}
        filterDate={date}
      />
    </section>
  );
}
