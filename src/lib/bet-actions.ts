"use server";

import { createClient } from "@/utils/supabase/server";
import { betSchema, type BetFormValues } from "./validations/bet";

interface InsertBetPayload {
  p_house: string;
  p_title: string;
  p_market: string;
  p_event_at: string;
  p_odd: number;
  p_result: BetFormValues["result"];
  p_units: number;
}

interface UpdateBetPayload {
  p_id: string;
  p_house: string;
  p_title: string;
  p_market: string;
  p_event_at: string;
  p_odd: number;
  p_units: number;
  p_result: BetFormValues["result"];
}

export async function createBetAction(values: BetFormValues) {
  const supabase = await createClient();

  const parsed = betSchema.safeParse(values);
  if (!parsed.success) {
    console.error("❌ Erros no Zod (server):", parsed.error.flatten());
    throw new Error("Dados inválidos");
  }

  const { house, title, market, event_at, odd, units, result } = parsed.data;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const payload: InsertBetPayload = {
    p_house: house,
    p_title: title,
    p_market: market ?? "",
    p_event_at: event_at.toISOString(),
    p_odd: odd,
    p_units: units,
    p_result: result,
  };

  const { data, error } = await supabase.rpc("insert_bet", payload);

  if (error) {
    console.error("❌ Erro ao inserir aposta:", error);
    throw error;
  }

  return data;
}

export async function updateBetResultAction(
  betId: string,
  result: string,
  cashoutReturnGross?: number
) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_bet_result", {
    p_bet_id: betId,
    p_result: result,
    p_cashout_return_gross:
      result === "cashout" ? cashoutReturnGross ?? 0 : null,
  });

  if (error) {
    console.error("❌ Erro ao atualizar aposta:", error);
    throw error;
  }

  return data;
}

export async function deleteBetAction(betId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_bet", {
    p_bet_id: betId,
  });

  if (error) {
    console.error("❌ Erro ao excluir aposta:", error);
    throw error;
  }
}

export async function updateBetAction(values: BetFormValues & { id: string }) {
  const supabase = await createClient();

  const payload: UpdateBetPayload = {
    p_id: values.id,
    p_house: values.house,
    p_title: values.title,
    p_market: values.market ?? "",
    p_event_at: values.event_at.toISOString(),
    p_odd: values.odd,
    p_units: values.units,
    p_result: values.result,
  };

  const { data, error } = await supabase.rpc("update_bet", payload);

  if (error) {
    console.error("❌ Erro ao atualizar aposta:", error);
    throw error;
  }

  return data;
}
