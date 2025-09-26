"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Bet = {
  id: string;
  event_name: string;
  house: string;
  event_at: string;
  odd: number;
  entry_amount: number;
  result: string;
  profit_loss: number;
};

export function BetsTable({
  betsToday,
  betsMonth,
  betsLast30,
}: {
  betsToday: Bet[];
  betsMonth: Bet[];
  betsLast30: Bet[];
}) {
  const renderTable = (data: Bet[]) => (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Casa</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Odd</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Resultado</TableHead>
            <TableHead>Lucro/Prejuízo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((bet) => (
              <TableRow key={bet.id}>
                <TableCell>{bet.event_name}</TableCell>
                <TableCell>{bet.house}</TableCell>
                <TableCell>
                  {new Date(bet.event_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>{bet.odd.toFixed(2)}</TableCell>
                <TableCell>R$ {bet.entry_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      bet.result === "green"
                        ? "default"
                        : bet.result === "red"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {bet.result}
                  </Badge>
                </TableCell>
                <TableCell
                  className={
                    bet.profit_loss >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  R$ {bet.profit_loss.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList>
        <TabsTrigger value="today">Hoje</TabsTrigger>
        <TabsTrigger value="month">Este mês</TabsTrigger>
        <TabsTrigger value="last30">Últimos 30 dias</TabsTrigger>
      </TabsList>

      <TabsContent value="today">{renderTable(betsToday)}</TabsContent>
      <TabsContent value="month">{renderTable(betsMonth)}</TabsContent>
      <TabsContent value="last30">{renderTable(betsLast30)}</TabsContent>
    </Tabs>
  );
}
