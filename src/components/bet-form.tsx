"use client";

import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { createBetAction, updateBetAction } from "@/lib/bet-actions";
import { updateUserHouses } from "@/lib/user-settings-actions";
import { betSchema, type BetFormValues } from "@/lib/validations/bet";
import { useUserSettings } from "@/providers/user-settings-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatInTimeZone } from "date-fns-tz";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Bet } from "./bets-datatable";
import { DatePicker } from "./date-picker";
import { HouseSelect } from "./house-select";
import { Input } from "./ui/input";
import { MaskedNumberInput } from "./ui/masked-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const EVENT_TIME_ZONE = "America/Sao_Paulo";

function toZonedMidnight(date: Date) {
  const zonedString = formatInTimeZone(
    date,
    EVENT_TIME_ZONE,
    "yyyy-MM-dd'T'00:00:00xxx"
  );
  return new Date(zonedString);
}

interface BetFormProps {
  onSuccess?: () => void;
  bet?: Bet;
}

export function BetForm({ onSuccess, bet }: BetFormProps) {
  const { userId, stakeValue, bettingHouses, setBettingHouses } =
    useUserSettings();

  const form = useForm<BetFormValues>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      house: bet?.house ?? "",
      title: bet?.title ?? "",
      market: bet?.market ?? "",
      event_at: bet?.event_at
        ? toZonedMidnight(new Date(bet.event_at))
        : toZonedMidnight(new Date()),
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

      const updatedHouses = await updateUserHouses(
        userId,
        values.house,
        stakeValue
      );
      if (updatedHouses) {
        setBettingHouses(updatedHouses);
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
        <Label aria-required htmlFor="house">
          Casa
        </Label>
        <HouseSelect
          value={form.watch("house")}
          onChange={(value) => form.setValue("house", value)}
          houses={bettingHouses}
        />
        {errors.house && (
          <p className="text-xs text-destructive">{errors.house.message}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label aria-required htmlFor="title">
          Evento
        </Label>
        <Input {...form.register("title")} placeholder="Evento" id="title" />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="market">Mercado</Label>
        <Input
          {...form.register("market")}
          placeholder="Mercado (opcional)"
          id="market"
        />
      </div>

      <div className="space-y-2">
        <Label aria-required htmlFor="event_at">
          Data do Evento
        </Label>
        <DatePicker
          value={form.watch("event_at")}
          onChange={(date) => {
            if (!date) return;
            form.setValue("event_at", toZonedMidnight(date));
          }}
        />
        {errors.event_at && (
          <p className="text-xs text-destructive">{errors.event_at.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label aria-required htmlFor="odd">
          Odd
        </Label>
        <MaskedNumberInput
          aria-required
          value={odd}
          onValueChange={(val) => form.setValue("odd", val ?? 0)}
          decimals={2}
          id="odd"
        />
        {errors.odd && (
          <p className="text-xs text-destructive">{errors.odd.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label aria-required htmlFor="units">
          Unidades
        </Label>
        <MaskedNumberInput
          aria-required
          value={units}
          onValueChange={(val) => {
            const u = Number((val ?? 0).toFixed(3));
            form.setValue("units", u);
          }}
          suffix="ᙀ"
          decimals={3}
          id="units"
        />
        {errors.units && (
          <p className="text-xs text-destructive">{errors.units.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label aria-required htmlFor="entryAmount">
          Valor (R$)
        </Label>
        <MaskedNumberInput
          aria-required
          value={entryAmount}
          onValueChange={(val) => {
            if (!effectiveStake) return;
            const raw = (val ?? 0) / effectiveStake;
            form.setValue("units", Number(raw.toFixed(3)));
          }}
          prefix="R$"
          decimals={2}
          id="entryAmount"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label aria-required htmlFor="result">
          Resultado
        </Label>
        <Select
          aria-required
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
          <p className="text-xs text-destructive">{errors.result.message}</p>
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
