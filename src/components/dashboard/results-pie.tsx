"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Extras = {
  greens: number;
  reds: number;
  refunds: number;
  cashouts: number;
};

const COLORS = ["#16a34a", "#dc2626", "#facc15", "#3b82f6"];

export function ResultsPie({ extras }: { extras: Extras }) {
  const data = [
    { name: "Greens", value: extras.greens },
    { name: "Reds", value: extras.reds },
    { name: "Refunds", value: extras.refunds },
    { name: "Cashouts", value: extras.cashouts },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Resultados</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}`, "Qtd"]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
