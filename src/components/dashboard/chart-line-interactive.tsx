"use client";

import { formatInTimeZone } from "date-fns-tz";
import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
  data: {
    date: string;
    total_staked: number;
    net_profit: number;
    roi_percent: number;
  }[];
};

const chartConfig = {
  total_staked: {
    label: "Total Apostado",
    color: "var(--chart-1)",
  },
  net_profit: {
    label: "Lucro Líquido",
    color: "var(--chart-2)",
  },
  roi_percent: {
    label: "ROI (%)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const CHART_TIME_ZONE = "America/Sao_Paulo";

function parseChartDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function ChartLineInteractive({ data }: Props) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("total_staked");

  const totals = React.useMemo(() => {
    return {
      total_staked: data.reduce((acc, curr) => acc + curr.total_staked, 0),
      net_profit: data.reduce((acc, curr) => acc + curr.net_profit, 0),
      roi_percent:
        data.length > 0
          ? data.reduce((acc, curr) => acc + curr.roi_percent, 0) / data.length
          : 0,
    };
  }, [data]);

  console.log(data);

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        {/* Header */}
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Indicadores (últimos 90 dias)</CardTitle>
          <CardDescription>
            Evolução diária das apostas e desempenho
          </CardDescription>
        </div>

        {/* Botões de métricas */}
        <div className="flex">
          {(["total_staked", "net_profit", "roi_percent"] as const).map(
            (key) => {
              const chart = chartConfig[key];
              return (
                <button
                  key={key}
                  data-active={activeChart === key}
                  className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(key)}
                >
                  <span className="text-muted-foreground text-xs">
                    {chart.label}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-2xl text-nowrap">
                    {key === "roi_percent"
                      ? `${totals[key].toFixed(2)}%`
                      : `R$ ${totals[key].toFixed(2)}`}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </CardHeader>

      {/* Gráfico */}
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) =>
                formatInTimeZone(
                  parseChartDate(value),
                  CHART_TIME_ZONE,
                  "dd MMM"
                )
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={chartConfig[activeChart].label}
                  labelFormatter={(value) =>
                    formatInTimeZone(
                      parseChartDate(String(value)),
                      CHART_TIME_ZONE,
                      "dd MMM yyyy"
                    )
                  }
                  formatter={(value: ValueType) => {
                    const numericValue = Number(
                      Array.isArray(value) ? value[0] : value ?? 0
                    );
                    if (Number.isNaN(numericValue)) {
                      return [value, chartConfig[activeChart].label];
                    }
                    if (activeChart === "roi_percent") {
                      return [
                        `${numericValue.toFixed(2)}% `,
                        chartConfig[activeChart].label,
                      ];
                    }
                    return [
                      `R$ ${numericValue.toFixed(2)} `,
                      chartConfig[activeChart].label,
                    ];
                  }}
                />
              }
            />

            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
