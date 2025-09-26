import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

export default async function SectionCards() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bets_summary_last_100_days")
    .select("*")
    .single();

  if (error || !data) {
    return <p>Erro ao carregar</p>;
  }

  const { total_apostado, lucro_liquido, roi_percent, green_count, red_count } =
    data;

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Apostado */}
      <Card>
        <CardHeader>
          <CardDescription>Total Apostado</CardDescription>
          <CardTitle>R$ {total_apostado.toFixed(2)}</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp /> últimos 100 dias
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <div>Volume apostado nos últimos 100 dias</div>
        </CardFooter>
      </Card>

      {/* Lucro Líquido */}
      <Card>
        <CardHeader>
          <CardDescription>Lucro Líquido</CardDescription>
          <CardTitle
            className={lucro_liquido >= 0 ? "text-green-600" : "text-red-600"}
          >
            R$ {lucro_liquido.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {lucro_liquido >= 0 ? (
                <>
                  <IconTrendingUp /> positivo
                </>
              ) : (
                <>
                  <IconTrendingDown /> negativo
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <div>Soma de ganhos e perdas</div>
        </CardFooter>
      </Card>

      {/* ROI */}
      <Card>
        <CardHeader>
          <CardDescription>ROI</CardDescription>
          <CardTitle
            className={roi_percent >= 0 ? "text-green-600" : "text-red-600"}
          >
            {roi_percent.toFixed(2)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {roi_percent >= 0 ? (
                <>
                  <IconTrendingUp /> positivo
                </>
              ) : (
                <>
                  <IconTrendingDown /> negativo
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <div>Retorno sobre o investimento</div>
        </CardFooter>
      </Card>

      {/* Greens x Reds */}
      <Card>
        <CardHeader>
          <CardDescription>Greens / Reds</CardDescription>
          <CardTitle>
            {green_count} / {red_count}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              Taxa de acerto:{" "}
              {green_count + red_count > 0
                ? ((green_count / (green_count + red_count)) * 100).toFixed(1) +
                  "%"
                : "0%"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <div>Apostas ganhas e perdidas</div>
        </CardFooter>
      </Card>
    </div>
  );
}
