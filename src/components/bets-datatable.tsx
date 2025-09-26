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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Check,
  DollarSign,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ConfirmActionModal } from "./confirm-action-modal";
import { DatePicker } from "./date-picker";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Bet = {
  id: string;
  house: string;
  title: string;
  market: string;
  event_at: string;
  odd: number;
  entry_amount: number;
  profit_loss: number;
  result: string;
};

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    label: string;
    result: string;
  } | null>(null);

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
        const result = row.getValue("result") as string;
        const variants: Record<
          string,
          | "default"
          | "secondary"
          | "destructive"
          | "outline"
          | "info"
          | "warning"
        > = {
          green: "default",
          red: "destructive",
          refund: "secondary",
          cashout: "info",
          pending: "warning",
        };

        return (
          <Badge variant={variants[result] ?? "outline"}>
            {result.charAt(0).toUpperCase() + result.slice(1)}
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

        const handleUpdate = (result: string, cashoutReturnGross?: number) => {
          startTransition(async () => {
            await updateBetResultAction(bet.id, result, cashoutReturnGross);
            router.refresh();
          });
        };

        const handleDelete = () => {
          startTransition(async () => {
            await deleteBetAction(bet.id);
            router.refresh();
          });
        };

        const handleAction = (result: string, label: string) => {
          setSelectedAction({ result, label });
          setModalOpen(true);
        };

        // 🔹 mapeamos as ações para deixar mais organizado
        const actions =
          bet.result === "pending"
            ? [
                {
                  result: "green",
                  label: "Marcar como Green",
                  icon: <Check className="h-4 w-4 text-green-600" />,
                },
                {
                  result: "red",
                  label: "Marcar como Red",
                  icon: <X className="h-4 w-4 text-red-600" />,
                },
                {
                  result: "cashout",
                  label: "Marcar como Cashout",
                  icon: <DollarSign className="h-4 w-4 text-yellow-600" />,
                },
              ]
            : [
                {
                  result: "pending",
                  label: "Voltar para Pending",
                  icon: <RotateCcw className="h-4 w-4 text-gray-500" />,
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
                    onClick={() => handleAction(action.result, action.label)}
                  >
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 focus:bg-red-50"
                  onClick={() => handleAction("delete", "Excluir aposta")}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-2">Excluir aposta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmActionModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              actionLabel={selectedAction?.label ?? ""}
              requireCashoutValue={selectedAction?.result === "cashout"}
              onConfirm={(value) => {
                if (!selectedAction) return;
                if (selectedAction.result === "delete") {
                  handleDelete();
                } else {
                  handleUpdate(selectedAction.result, value);
                }
              }}
            />
          </>
        );
      },
    },
  ];

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
            value={filterDate ? new Date(filterDate) : undefined}
            onChange={(date) =>
              updateParams({
                date: date ? date.toISOString().split("T")[0] : undefined, // yyyy-MM-dd
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
    </div>
  );
}
