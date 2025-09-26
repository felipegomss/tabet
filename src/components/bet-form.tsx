"use client";

import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { createBetAction } from "@/lib/bet-actions";
import { betSchema, type BetFormValues } from "@/lib/validations/bet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DatePicker } from "./date-picker";
import { MaskedNumberInput } from "./ui/masked-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function BetForm({
  userId,
  stake,
  onSuccess,
}: {
  userId: string;
  stake: number;
  onSuccess?: () => void;
}) {
  const form = useForm<BetFormValues>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      house: "",
      title: "",
      market: "",
      event_at: new Date(),
      odd: 1,
      units: 1,
      result: "pending",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // valores observados
  const units = useWatch({ control: form.control, name: "units" });
  const odd = useWatch({ control: form.control, name: "odd" });

  // valor calculado (unidades * stake do usuário)
  const entryAmount = units && stake ? Number((units * stake).toFixed(2)) : 0;

  const onSubmit = async (values: BetFormValues) => {
    try {
      setLoading(true);
      await createBetAction(values, userId);
      router.refresh();
      if (onSuccess) onSuccess(); // 🔹 fecha modal se informado
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
          onValueChange={(val) => form.setValue("odd", val)}
          decimals={2}
          suffix="%"
        />
        {errors.odd && (
          <p className="text-xs text-red-500">{errors.odd.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Unidades</Label>
        <MaskedNumberInput
          value={units}
          onValueChange={(val) => form.setValue("units", val)}
          suffix="ᙀ"
          decimals={2}
        />
        {errors.units && (
          <p className="text-xs text-red-500">{errors.units.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Valor (R$)</Label>
        <MaskedNumberInput
          value={entryAmount}
          onValueChange={(val) =>
            form.setValue("units", Number((val / stake).toFixed(2)))
          }
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
