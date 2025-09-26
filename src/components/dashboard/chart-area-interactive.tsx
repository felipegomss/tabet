"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  lucro_liquido: {
    label: "Lucro Líquido",
    color: "var(--primary)",
  },
  total_apostado: {
    label: "Total Apostado",
    color: "var(--secondary)",
  },
};

type Props = {
  initialData: {
    date: string;
    total_apostado: number;
    lucro_liquido: number;
    greens: number;
    reds: number;
  }[];
};

export function ChartAreaInteractive({ initialData }: Props) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    if (!initialData.length) return [];
    const referenceDate = new Date();
    const daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() - daysToSubtract);
    return initialData.filter((item) => new Date(item.date) >= startDate);
  }, [initialData, timeRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho das Apostas</CardTitle>
        <CardDescription>Evolução de banca e exposição</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últ. 90 dias</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últ. 30 dias</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últ. 7 dias</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Últ. 90 dias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Últ. 90 dias</SelectItem>
              <SelectItem value="30d">Últ. 30 dias</SelectItem>
              <SelectItem value="7d">Últ. 7 dias</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillLucro" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-lucro_liquido)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-lucro_liquido)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAposta" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total_apostado)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total_apostado)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
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
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total_apostado"
              type="natural"
              fill="url(#fillAposta)"
              stroke="var(--color-total_apostado)"
            />
            <Area
              dataKey="lucro_liquido"
              type="natural"
              fill="url(#fillLucro)"
              stroke="var(--color-lucro_liquido)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
