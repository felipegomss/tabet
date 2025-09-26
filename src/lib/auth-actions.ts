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
    return redirect("/signup?message=Preencha todos os campos corretamente.");
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

function getAppUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  return envUrl ?? "http://localhost:3000";
}

export async function sendPasswordResetAction(formData: FormData) {
  const email = formData.get("email");
  const redirectToParam = formData.get("redirectTo");

  const nextParams = new URLSearchParams();
  if (typeof redirectToParam === "string" && redirectToParam.length > 0) {
    nextParams.set("redirectTo", redirectToParam);
  }

  if (typeof email !== "string" || !email) {
    nextParams.set("status", "error");
    nextParams.set("message", "Informe um email válido.");
    return redirect(`/forgot-password?${nextParams.toString()}`);
  }

  const supabase = await createClient();
  const redirectTo = new URL("/reset-password", getAppUrl()).toString();

  console.log("[sendPasswordResetAction] requesting password reset", {
    email,
    redirectTo,
  });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error("[sendPasswordResetAction] failed", error);
    nextParams.set("status", "error");
    nextParams.set(
      "message",
      error.message || "Não foi possível enviar o email de recuperação."
    );
    return redirect(`/forgot-password?${nextParams.toString()}`);
  }

  console.log("[sendPasswordResetAction] success for", email);

  nextParams.set("status", "success");
  nextParams.set(
    "message",
    "Enviamos um link de recuperação. Verifique sua caixa de entrada."
  );

  return redirect(`/forgot-password?${nextParams.toString()}`);
}

export async function completePasswordResetAction(formData: FormData) {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const confirmPassword = formData.get("confirmPassword") as string | null;
  const token = formData.get("token") as string | null;

  if (!email) {
    return redirect(
      `/reset-password?message=${encodeURIComponent(
        "Informe o email associado à sua conta."
      )}`
    );
  }
  if (!password || password.length < 8) {
    return redirect(
      `/reset-password?message=${encodeURIComponent(
        "A nova senha deve ter pelo menos 8 caracteres."
      )}&email=${encodeURIComponent(email)}&token=${encodeURIComponent(
        token ?? ""
      )}`
    );
  }
  if (password !== confirmPassword) {
    return redirect(
      `/reset-password?message=${encodeURIComponent(
        "As senhas não coincidem."
      )}&email=${encodeURIComponent(email)}&token=${encodeURIComponent(
        token ?? ""
      )}`
    );
  }
  if (!token) {
    return redirect(
      `/reset-password?message=${encodeURIComponent(
        "Link inválido ou expirado. Solicite uma nova redefinição."
      )}`
    );
  }

  const supabase = await createClient();

  // Passo 1: troca o token pela sessão de recuperação
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    token
  );
  if (exchangeError) {
    return redirect(
      `/reset-password?message=${encodeURIComponent(exchangeError.message)}`
    );
  }

  // Passo 2: atualiza a senha
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return redirect(
      `/reset-password?message=${encodeURIComponent(error.message)}`
    );
  }

  return redirect(
    `/login?message=${encodeURIComponent(
      "Senha redefinida com sucesso. Faça login com sua nova senha."
    )}`
  );
}
