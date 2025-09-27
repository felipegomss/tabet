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
import { formatInTimeZone } from "date-fns-tz";

type Bet = {
  id: string;
  title: string;
  house: string;
  event_at: string;
  odd: number;
  entry_amount: number;
  result: "pending" | "green" | "red" | "refund" | "cashout";
  profit_loss: number;
};

const RESULT_BADGE_VARIANT: Record<
  Bet["result"],
  "default" | "secondary" | "destructive" | "outline" | "info" | "warning"
> = {
  green: "default",
  red: "destructive",
  refund: "warning",
  cashout: "info",
  pending: "outline",
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
                <TableCell>{bet.title}</TableCell>
                <TableCell>{bet.house}</TableCell>
                <TableCell>
                  {formatInTimeZone(
                    bet.event_at,
                    "America/Sao_Paulo",
                    "dd/MM/yyyy"
                  )}
                </TableCell>
                <TableCell>{bet.odd.toFixed(2)}</TableCell>
                <TableCell>R$ {bet.entry_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={RESULT_BADGE_VARIANT[bet.result] ?? "outline"}
                  >
                    {bet.result.charAt(0).toUpperCase() + bet.result.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell
                  className={
                    bet.profit_loss >= 0 ? "text-primary" : "text-destructive"
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
