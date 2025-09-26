"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Balance = {
  dia: string; // YYYY-MM-DD
  lucro_dia: number;
  saldo_acumulado: number;
};

const chartConfig = {
  saldo_acumulado: {
    label: "Saldo Acumulado",
    color: "var(--chart-1)",
  },
  lucro_dia: {
    label: "Lucro do Dia",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatCurrencyValue(value: string | number) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }
  return `R$ ${numericValue.toFixed(2)}`;
}

export function BalanceChart({ balance }: { balance: Balance[] }) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = React.useMemo(() => {
    if (!balance?.length) return [];
    const referenceDate = new Date();
    const daysToSubtract =
      timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;

    const startDate = new Date();
    startDate.setDate(referenceDate.getDate() - daysToSubtract);

    return balance.filter((item) => new Date(item.dia) >= startDate);
  }, [balance, timeRange]);

  console.log(balance);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Evolução da Banca</CardTitle>
          <CardDescription>
            Histórico acumulado dos últimos {timeRange.replace("d", "")} dias
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Selecione um período"
          >
            <SelectValue placeholder="Últimos 90 dias" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-saldo_acumulado)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-saldo_acumulado)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillLucro" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-lucro_dia)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-lucro_dia)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dia"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  }
                  formatter={(value: ValueType, name: NameType) => {
                    const resolvedValue = Array.isArray(value)
                      ? value[0]
                      : value;
                    const key = String(name);
                    const label =
                      key === "saldo_acumulado"
                        ? " Saldo Acumulado"
                        : " Lucro do Dia";
                    return [formatCurrencyValue(resolvedValue ?? 0), label];
                  }}
                />
              }
            />
            <Area
              dataKey="saldo_acumulado"
              type="monotone"
              fill="url(#fillSaldo)"
              stroke="var(--color-saldo_acumulado)"
              strokeWidth={2}
            />
            <Area
              dataKey="lucro_dia"
              type="monotone"
              fill="url(#fillLucro)"
              stroke="var(--color-lucro_dia)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
