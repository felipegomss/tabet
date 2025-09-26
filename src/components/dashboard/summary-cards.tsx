"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

type Summary = {
  total_apostado: number;
  lucro_liquido: number;
  roi_percent: number;
  green_count: number;
  red_count: number;
};

type Extras = {
  odd_media: number;
  stake_media: number;
  maior_green: number;
  maior_red: number;
  greens: number;
  reds: number;
  refunds: number;
  cashouts: number;
};

export function SummaryCards({
  summary,
  extras,
}: {
  summary: Summary;
  extras: Extras;
}) {
  const { total_apostado, lucro_liquido, roi_percent, green_count, red_count } =
    summary;

  const { odd_media, stake_media, maior_green, maior_red } = extras;

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Apostado */}
      <Card>
        <CardHeader>
          <CardDescription>Total Apostado</CardDescription>
          <CardTitle>R$ {total_apostado.toFixed(2)}</CardTitle>
          <CardAction>
            <Badge variant="outline">Últimos 100 dias</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <div>Volume investido no período</div>
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

      {/* Odd Média */}
      <Card>
        <CardHeader>
          <CardDescription>Odd Média</CardDescription>
          <CardTitle>{odd_media.toFixed(2)}</CardTitle>
          <CardAction>
            <Badge variant="outline">Média geral</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <div>Tendência do perfil de risco</div>
        </CardFooter>
      </Card>

      {/* Stake Média */}
      <Card>
        <CardHeader>
          <CardDescription>Stake Média</CardDescription>
          <CardTitle>R$ {stake_media.toFixed(2)}</CardTitle>
          <CardAction>
            <Badge variant="outline">Média por aposta</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <div>Valor médio investido</div>
        </CardFooter>
      </Card>

      {/* Maior Green */}
      <Card>
        <CardHeader>
          <CardDescription>Maior Green</CardDescription>
          <CardTitle className="text-green-600">
            +R$ {maior_green.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Ganho máximo</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <div>Melhor resultado isolado</div>
        </CardFooter>
      </Card>

      {/* Maior Red */}
      <Card>
        <CardHeader>
          <CardDescription>Maior Red</CardDescription>
          <CardTitle className="text-red-600">
            R$ {maior_red.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Perda máxima</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <div>Pior resultado isolado</div>
        </CardFooter>
      </Card>
    </div>
  );
}
