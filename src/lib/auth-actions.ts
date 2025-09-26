"use server";

import { getSafeRedirectPath } from "@/utils/navigation";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(redirectTo: string, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return redirect("/login?message=Credenciais inválidas.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  return redirect(getSafeRedirectPath(redirectTo));
}

export async function signupAction(redirectTo: string, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return redirect(
      "/signup?message=Preencha todos os campos corretamente."
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  return redirect(getSafeRedirectPath(redirectTo));
}

export async function signOutAction() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Erro ao sair da sessão:", error);
    throw error;
  }

  redirect("/login");
}
