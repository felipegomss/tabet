"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Line, LineChart } from "recharts";

type Props = {
  accuracy: { date: string; value: number }[];
  avgStake: { date: string; value: number }[];
  className?: string;
  chartClassName?: string;
};
type TrendDatum = { date: string; value: number };

type TrendTone = "positive" | "negative" | "neutral";

type TrendCardProps = {
  title: string;
  subtitle?: string;
  formattedValue: string;
  variationText: string;
  tone: TrendTone;
  data: TrendDatum[];
  colorVar: string;
  chartClassName?: string;
};

function TrendCard({
  title,
  subtitle,
  formattedValue,
  variationText,
  tone,
  data,
  colorVar,
  chartClassName,
}: TrendCardProps) {
  const toneClassMap: Record<TrendTone, string> = {
    positive: "text-primary",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const trendChartConfig = {
    value: {
      color: colorVar,
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex max-h-[250px] flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-normal">{title}</CardTitle>
        {subtitle ? (
          <CardDescription className="text-xs font-normal">
            {subtitle}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-3 pb-3">
        <div>
          <div className="text-2xl font-bold">{formattedValue}</div>
          <p className={`text-xs ${toneClassMap[tone]}`}>{variationText}</p>
        </div>

        <ChartContainer
          config={trendChartConfig}
          className={cn(
            "mt-auto w-full flex-1 min-h-[4rem] max-h-24",
            chartClassName
          )}
        >
          <LineChart data={data}>
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="value"
              stroke={colorVar}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function buildVariation({
  latest,
  first,
  compare,
}: {
  latest: number | undefined;
  first: number | undefined;
  compare: (latest: number, first: number) => { text: string; tone: TrendTone };
}): { text: string; tone: TrendTone } {
  if (typeof latest === "number" && typeof first === "number") {
    return compare(latest, first);
  }
  return { text: "sem variação", tone: "neutral" };
}

export function CardsStats({
  accuracy,
  avgStake,
  className,
  chartClassName,
}: Props) {
  const latestAccuracy = accuracy?.at(-1)?.value;
  const firstAccuracy = accuracy?.[0]?.value;

  const accuracyVariation = buildVariation({
    latest: latestAccuracy,
    first: firstAccuracy,
    compare: (latest, first) => {
      const diff = latest - first;
      const tone: TrendTone =
        diff === 0 ? "neutral" : diff > 0 ? "positive" : "negative";
      return {
        text: `${diff.toFixed(1)}% vs últimos 90 dias`,
        tone,
      };
    },
  });

  const latestStake = avgStake?.at(-1)?.value;
  const firstStake = avgStake?.[0]?.value;

  const stakeVariation = buildVariation({
    latest: latestStake,
    first: firstStake,
    compare: (latest, first) => {
      const percent = ((latest - first) / (first || 1)) * 100;
      const tone: TrendTone =
        percent === 0 ? "neutral" : percent > 0 ? "positive" : "negative";
      return {
        text: `${percent.toFixed(1)}% vs últimos  90 dias`,
        tone,
      };
    },
  });

  return (
    <div className={cn("grid h-full min-h-0 grid-rows-2 gap-4", className)}>
      <TrendCard
        title="Taxa de Acerto"
        subtitle="(hoje)"
        formattedValue={
          typeof latestAccuracy === "number"
            ? `${latestAccuracy.toFixed(1)}%`
            : "0%"
        }
        variationText={accuracyVariation.text}
        tone={accuracyVariation.tone}
        data={accuracy}
        colorVar="var(--chart-2)"
        chartClassName={chartClassName}
      />

      <TrendCard
        title="Stake Média"
        subtitle="(hoje)"
        formattedValue={`R$${
          typeof latestStake === "number" ? latestStake.toFixed(2) : "0,00"
        }`}
        variationText={stakeVariation.text}
        tone={stakeVariation.tone}
        data={avgStake}
        colorVar="var(--chart-4)"
        chartClassName={chartClassName}
      />
    </div>
  );
}
