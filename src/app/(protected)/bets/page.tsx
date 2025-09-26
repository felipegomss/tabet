import { BetsDataTable } from "@/components/bets-datatable";
import { createClient } from "@/utils/supabase/server";

type Props = {
  searchParams: {
    page?: string;
    result?: string;
    title?: string;
    date?: string;
  };
};

export default async function BetsPage({ searchParams }: Props) {
  const supabase = await createClient();

  const pageSize = 10;
  const pageIndex = Number(searchParams.page ?? 0);
  const filterResult = searchParams.result;
  const filterTitle = searchParams.title;
  const date = searchParams.date ?? undefined;

  let query = supabase
    .from("bets")
    .select("*", { count: "exact" })
    .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)
    .order("event_at", { ascending: false });

  if (filterTitle) query = query.ilike("title", `%${filterTitle}%`);
  if (filterResult) query = query.eq("result", filterResult);
  if (date) {
    const startDate = new Date(`${date}T00:00:00`);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    query = query
      .gte("event_at", startDate.toISOString())
      .lt("event_at", endDate.toISOString());
  }

  console.log(query);

  const { data, count } = await query;

  console.log(data);

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
        filterTitle={filterTitle}
        filterDate={date}
      />
    </section>
  );
}
