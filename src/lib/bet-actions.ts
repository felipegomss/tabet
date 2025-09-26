// lib/bet-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { betSchema, type BetFormValues } from "./validations/bet";

export async function createBetAction(values: BetFormValues, userId: string) {
  const supabase = await createClient();

  const parsed = betSchema.safeParse(values);
  if (!parsed.success) {
    console.error("❌ Erros no Zod (server):", parsed.error.flatten());
    throw new Error("Dados inválidos");
  }

  const { house, title, market, event_at, odd, units, result } = parsed.data;

  // mesmo que o entry_amount não seja usado no insert (coluna calculada),
  // precisamos mandar para bater com a assinatura
  const { data, error } = await supabase.rpc("insert_bet", {
    p_user_id: userId,
    p_house: house,
    p_title: title,
    p_market: market ?? "",
    p_event_at: event_at.toISOString(),
    p_odd: odd,
    p_units: units,
    p_entry_amount: null, // 🔹 sempre null (ou poderia calcular só pra enviar)
    p_result: result,
  });

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
