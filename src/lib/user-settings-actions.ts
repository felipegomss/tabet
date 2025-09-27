"use server";

import { createClient } from "@/utils/supabase/server";

function normalizeHouses(houses: string[]) {
  return Array.from(
    new Set(
      houses
        .map((house) => house.trim())
        .filter((house) => house.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
}

export async function saveUserHouses(
  userId: string,
  houses: string[],
  stakeValue: number | null
) {
  const supabase = await createClient();

  const normalized = normalizeHouses(houses);
  const timestamp = new Date().toISOString();

  const { data, error: fetchError } = await supabase
    .from("user_settings")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error("❌ Erro ao buscar user_settings:", fetchError);
    throw fetchError;
  }

  if (data) {
    const { error: updateError } = await supabase
      .from("user_settings")
      .update({ betting_houses: normalized, updated_at: timestamp })
      .eq("user_id", userId);

    if (updateError) {
      console.error("❌ Erro ao atualizar betting_houses:", updateError);
      throw updateError;
    }
  } else {
    const { error: insertError } = await supabase.from("user_settings").insert({
      user_id: userId,
      stake_value: stakeValue ?? 0,
      betting_houses: normalized,
      updated_at: timestamp,
    });

    if (insertError) {
      console.error("❌ Erro ao criar betting_houses:", insertError);
      throw insertError;
    }
  }

  return normalized;
}

export async function updateUserHouses(
  userId: string,
  house: string,
  stakeValue: number | null
) {
  const supabase = await createClient();

  const { data, error: fetchError } = await supabase
    .from("user_settings")
    .select("betting_houses, stake_value")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error("❌ Erro ao buscar user_settings:", fetchError);
    throw fetchError;
  }

  const current = data?.betting_houses ?? [];

  if (current.includes(house)) return current;

  const updated = normalizeHouses([...current, house]);
  const timestamp = new Date().toISOString();

  if (data) {
    const { error: updateError } = await supabase
      .from("user_settings")
      .update({ betting_houses: updated, updated_at: timestamp })
      .eq("user_id", userId);

    if (updateError) {
      console.error("❌ Erro ao atualizar betting_houses:", updateError);
      throw updateError;
    }
  } else {
    const { error: insertError } = await supabase.from("user_settings").insert({
      user_id: userId,
      stake_value: stakeValue ?? 0,
      betting_houses: updated,
      updated_at: timestamp,
    });

    if (insertError) {
      console.error("❌ Erro ao criar betting_houses:", insertError);
      throw insertError;
    }
  }

  return updated;
}
