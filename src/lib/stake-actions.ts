"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveStakeAction(userId: string, stake: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_settings").upsert({
    user_id: userId,
    stake_value: stake,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Erro ao salvar stake:", error);
    throw error;
  }
}
