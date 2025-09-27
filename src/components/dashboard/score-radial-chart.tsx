"use client";

import * as React from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

type Props = {
  subtitle?: string;
  score: number;
  scoreMin?: number;
  scoreMax?: number;
  endAngle?: number;
};

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-2)",
  },
  track: {
    label: "Track",
    color: "var(--muted)", // trilho clarinho
  },
} satisfies ChartConfig;

export function ScoreRadialChart({
  subtitle,
  score,
  scoreMin = -300,
  scoreMax = 300,
  endAngle = 180,
}: Props) {
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));

  // Normaliza o score para 0..100 (preenchimento do anel)
  const normalized = React.useMemo(() => {
    if (scoreMax === scoreMin) return 0;
    const pct = ((score - scoreMin) / (scoreMax - scoreMin)) * 100;
    return clamp(pct, 0, 100);
  }, [score, scoreMin, scoreMax]);

  // Dois pontos: 100% (trilho) e o valor (score)
  const chartData = React.useMemo(
    () => [
      { name: "track", value: 100 }, // trilho de fundo
      { name: "score", value: normalized }, // preenchimento real
    ],
    [normalized]
  );

  // Para meia-lua mais “natural”, começamos à esquerda (180°) e vamos até 0°
  const startAngle = endAngle === 360 ? 0 : 180;
  const finalEndAngle = endAngle === 360 ? 360 : 0;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[260px]"
    >
      <RadialBarChart
        data={chartData}
        innerRadius={80}
        outerRadius={130}
        startAngle={startAngle}
        endAngle={finalEndAngle}
        className="translate-y-[10%]"
      >
        <PolarRadiusAxis
          tick={false}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 14}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {score.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 10}
                      className="fill-muted-foreground text-xs"
                    >
                      {subtitle}
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </PolarRadiusAxis>

        <RadialBar
          dataKey="value"
          data={[chartData[0]]}
          cornerRadius={5}
          className="stroke-transparent"
          fill="var(--color-track)"
          background={false}
          isAnimationActive={false}
        />

        <RadialBar
          dataKey="value"
          data={[chartData[1]]}
          cornerRadius={5}
          className="stroke-transparent"
          fill="var(--color-score)"
          isAnimationActive
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
