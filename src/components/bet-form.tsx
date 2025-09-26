"use client";

import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { createBetAction, updateBetAction } from "@/lib/bet-actions";
import { betSchema, type BetFormValues } from "@/lib/validations/bet";
import { useUserSettings } from "@/providers/user-settings-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Bet } from "./bets-datatable";
import { DatePicker } from "./date-picker";
import { MaskedNumberInput } from "./ui/masked-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface BetFormProps {
  onSuccess?: () => void;
  bet?: Bet;
}

export function BetForm({ onSuccess, bet }: BetFormProps) {
  const { userId, stakeValue } = useUserSettings();
  const form = useForm<BetFormValues>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      house: bet?.house ?? "",
      title: bet?.title ?? "",
      market: bet?.market ?? "",
      event_at: bet?.event_at ? new Date(bet.event_at) : new Date(),
      odd: bet?.odd ?? 1,
      units: bet?.units ?? 1,
      result: bet?.result ?? "pending",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const units = useWatch({ control: form.control, name: "units" });
  const odd = useWatch({ control: form.control, name: "odd" });

  const round2 = (n: number) => Math.round(n * 100) / 100;

  const effectiveStake = stakeValue && stakeValue > 0 ? stakeValue : 0;

  const entryAmount =
    units && effectiveStake ? round2(units * effectiveStake) : 0;

  const onSubmit = async (values: BetFormValues) => {
    try {
      setLoading(true);
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }
      if (bet?.id) {
        await updateBetAction({ ...values, id: bet.id });
      } else {
        await createBetAction(values);
      }
      router.refresh();
      onSuccess?.();
    } catch (err) {
      console.error("❌ Erro no submit:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) =>
        console.error("❌ Erros de validação:", err)
      )}
      className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="space-y-2 sm:col-span-2">
        <Label>Casa</Label>
        <input
          {...form.register("house")}
          className="w-full rounded-md border px-2 py-2"
          placeholder="Casa de apostas"
        />
        {errors.house && (
          <p className="text-xs text-red-500">{errors.house.message}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Evento</Label>
        <input
          {...form.register("title")}
          className="w-full rounded-md border px-2 py-2"
          placeholder="Evento"
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Mercado</Label>
        <input
          {...form.register("market")}
          className="w-full rounded-md border px-2 py-2"
          placeholder="Mercado (opcional)"
        />
      </div>

      <div className="space-y-2">
        <Label>Data do Evento</Label>
        <DatePicker
          value={form.watch("event_at")}
          onChange={(date) => form.setValue("event_at", date!)}
        />
        {errors.event_at && (
          <p className="text-xs text-red-500">{errors.event_at.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Odd</Label>
        <MaskedNumberInput
          value={odd}
          onValueChange={(val) => form.setValue("odd", val ?? 0)}
          decimals={2}
        />
        {errors.odd && (
          <p className="text-xs text-red-500">{errors.odd.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Unidades</Label>
        <MaskedNumberInput
          value={units}
          onValueChange={(val) => {
            const u = Number((val ?? 0).toFixed(3));
            form.setValue("units", u);
          }}
          suffix="ᙀ"
          decimals={3}
        />
        {errors.units && (
          <p className="text-xs text-red-500">{errors.units.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Valor (R$)</Label>
        <MaskedNumberInput
          value={entryAmount}
          onValueChange={(val) => {
            if (!effectiveStake) return;
            const raw = (val ?? 0) / effectiveStake;
            form.setValue("units", Number(raw.toFixed(3)));
          }}
          prefix="R$"
          decimals={2}
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Resultado</Label>
        <Select
          value={form.watch("result")}
          onValueChange={(val) =>
            form.setValue("result", val as BetFormValues["result"])
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o resultado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="red">Red</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
            <SelectItem value="cashout">Cashout</SelectItem>
          </SelectContent>
        </Select>
        {errors.result && (
          <p className="text-xs text-red-500">{errors.result.message}</p>
        )}
      </div>

      <div className="flex justify-end sm:col-span-2">
        <SubmitButton
          className="min-w-[9rem]"
          loadingText="Salvando..."
          isLoading={loading}
        >
          Salvar Aposta
        </SubmitButton>
      </div>
    </form>
  );
}
