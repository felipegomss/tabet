"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteBetAction, updateBetResultAction } from "@/lib/bet-actions";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatInTimeZone } from "date-fns-tz";
import {
  BanknoteArrowDown,
  Check,
  Edit,
  Loader2,
  MoreHorizontal,
  RefreshCcw,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { BetForm } from "./bet-form";
import { ConfirmActionModal } from "./confirm-action-modal";
import { DatePicker } from "./date-picker";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type Bet = {
  id: string;
  house: string;
  title: string;
  market: string;
  units: number;
  event_at: string;
  odd: number;
  entry_amount: number;
  profit_loss: number;
  result: "pending" | "green" | "red" | "refund" | "cashout";
};

type BetResult = Bet["result"];

const RESULT_BADGE_VARIANT: Record<
  BetResult,
  "default" | "secondary" | "destructive" | "outline" | "info" | "warning"
> = {
  green: "default",
  red: "destructive",
  refund: "secondary",
  cashout: "info",
  pending: "warning",
};

const RESULT_ICON_COLOR: Record<BetResult, string> = {
  green: "text-primary",
  red: "text-destructive",
  refund: "text-secondary-foreground",
  cashout: "text-blue-500",
  pending: "text-yellow-500",
};

const DATE_FILTER_TIME_ZONE = "America/Sao_Paulo";

interface BetsTableProps {
  data: Bet[];
  total: number;
  pageSize: number;
  pageIndex: number;
  filterResult?: string;
  filterTitle?: string;
  filterDate?: string;
}

export function BetsDataTable({
  data,
  total,
  pageSize,
  pageIndex,
  filterResult,
  filterTitle,
  filterDate,
}: BetsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [modalState, setModalState] = useState<{
    betId: string;
    label: string;
    result: BetResult | "delete";
    title: string;
  } | null>(null);
  const [editModalState, setEditModalState] = useState<{
    betId: string;
  } | null>(null);
  const [loadingBetId, setLoadingBetId] = useState<string | null>(null);

  const columns: ColumnDef<Bet>[] = [
    {
      accessorKey: "event_at",
      header: "Data",
      cell: ({ row }) =>
        new Date(row.getValue("event_at")).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    { accessorKey: "house", header: "Casa" },
    { accessorKey: "title", header: "Evento" },
    { accessorKey: "market", header: "Mercado" },
    {
      accessorKey: "odd",
      header: "Odd",
      cell: ({ row }) => Number(row.getValue("odd")).toFixed(2),
    },
    {
      accessorKey: "entry_amount",
      header: "Aposta",
      cell: ({ row }) =>
        `R$ ${Number(row.getValue("entry_amount")).toFixed(2)}`,
    },
    {
      accessorKey: "profit_loss",
      header: "Lucro/Prejuízo",
      cell: ({ row }) => {
        const val = Number(row.getValue("profit_loss"));
        return (
          <span className={val >= 0 ? "text-green-600" : "text-red-600"}>
            R$ {val.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "result",
      header: "Resultado",
      cell: ({ row }) => {
        const result = row.getValue("result") as BetResult;
        const variant = RESULT_BADGE_VARIANT[result] ?? "outline";
        const isLoading = loadingBetId === row.original.id;

        return (
          <Badge variant={variant}>
            {result.charAt(0).toUpperCase() + result.slice(1)}
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const bet = row.original;

        const handleAction = (result: BetResult | "delete", label: string) => {
          setModalState({
            betId: bet.id,
            result,
            label,
            title: bet.title,
          });
        };

        const actions =
          bet.result === "pending"
            ? [
                {
                  result: "green" as const,
                  label: "Marcar como Green",
                  icon: (
                    <Check
                      className={cn(
                        "h-4 w-4",
                        RESULT_ICON_COLOR.green ?? "text-foreground"
                      )}
                    />
                  ),
                },
                {
                  result: "refund" as const,
                  label: "Marcar como Refund",
                  icon: (
                    <RefreshCcw
                      className={cn(
                        "h-4 w-4",
                        RESULT_ICON_COLOR.refund ?? "text-foreground"
                      )}
                    />
                  ),
                },
                {
                  result: "red" as const,
                  label: "Marcar como Red",
                  icon: (
                    <X
                      className={cn(
                        "h-4 w-4",
                        RESULT_ICON_COLOR.red ?? "text-foreground"
                      )}
                    />
                  ),
                },
                {
                  result: "cashout" as const,
                  label: "Marcar como Cashout",
                  icon: (
                    <BanknoteArrowDown
                      className={cn(
                        "h-4 w-4",
                        RESULT_ICON_COLOR.cashout ?? "text-foreground"
                      )}
                    />
                  ),
                },
              ]
            : [
                {
                  result: "pending" as const,
                  label: "Voltar para Pending",
                  icon: (
                    <RotateCcw
                      className={cn(
                        "h-4 w-4",
                        RESULT_ICON_COLOR.pending ?? "text-foreground"
                      )}
                    />
                  ),
                },
              ];

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  disabled={isPending}
                >
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>

                {actions.map((action) => (
                  <DropdownMenuItem
                    key={action.result}
                    onClick={() =>
                      handleAction(
                        action.result as
                          | "pending"
                          | "green"
                          | "red"
                          | "refund"
                          | "cashout",
                        action.label
                      )
                    }
                  >
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setEditModalState({ betId: bet.id })}
                >
                  <Edit className="h-4 w-4" />
                  <span className="ml-2">Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleAction("delete", "Excluir aposta")}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-2">Excluir aposta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const handleConfirmAction = (cashoutValue?: number) => {
    if (!modalState) return;

    const { betId, result } = modalState;

    setLoadingBetId(betId);
    startTransition(async () => {
      try {
        if (result === "delete") {
          await deleteBetAction(betId);
        } else {
          await updateBetResultAction(
            betId,
            result,
            result === "cashout" ? cashoutValue : undefined
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setModalState(null);
        router.refresh();
        setLoadingBetId(null);
      }
    });
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pageSize),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const updateParams = (
    params: Record<string, string | number | undefined>
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "") newParams.delete(key);
      else newParams.set(key, String(value));
    });
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Filtrar por evento..."
            defaultValue={filterTitle ?? ""}
            onChange={(e) => updateParams({ title: e.target.value, page: 0 })}
            className="max-w-xs"
          />

          <Select
            value={filterResult ?? "all"}
            onValueChange={(value) =>
              updateParams({
                result: value === "all" ? undefined : value,
                page: 0,
              })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Resultado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="cashout">Cashout</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[250px]">
          <DatePicker
            value={filterDate ? new Date(`${filterDate}T00:00:00`) : undefined}
            onChange={(date) =>
              updateParams({
                date: date
                  ? formatInTimeZone(date, DATE_FILTER_TIME_ZONE, "yyyy-MM-dd")
                  : undefined,
                page: 0,
              })
            }
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-end space-x-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateParams({ page: pageIndex - 1 })}
          disabled={pageIndex === 0}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateParams({ page: pageIndex + 1 })}
          disabled={pageIndex >= Math.ceil(total / pageSize) - 1}
        >
          Próximo
        </Button>
      </div>

      <ConfirmActionModal
        open={modalState !== null}
        onClose={() => setModalState(null)}
        actionLabel={modalState?.label ?? ""}
        description={
          modalState
            ? `Deseja realmente ${modalState.label.toLowerCase()} "${
                modalState.title
              }"?`
            : undefined
        }
        requireCashoutValue={modalState?.result === "cashout"}
        onConfirm={handleConfirmAction}
      />
      <Dialog
        open={editModalState !== null}
        onOpenChange={() => setEditModalState(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Aposta</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para editar a aposta.
            </DialogDescription>
          </DialogHeader>
          <BetForm
            onSuccess={() => setEditModalState(null)}
            bet={
              editModalState?.betId
                ? data.find((bet) => bet.id === editModalState.betId)
                : undefined
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
