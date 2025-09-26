import Link from "next/link";

import { SubmitButton } from "@/components/submit-button";
import { completePasswordResetAction } from "@/lib/auth-actions";
import { getFirstSearchParamValue } from "@/utils/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const message = getFirstSearchParamValue(params.message);
  const email = getFirstSearchParamValue(params.email);
  const token = getFirstSearchParamValue(params.token);
  const code = getFirstSearchParamValue(params.code);

  const effectiveToken = token ?? code;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Definir nova senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Informe sua nova senha. Ela deve ter pelo menos 8 caracteres.
          </p>
        </div>
        <form action={completePasswordResetAction} className="space-y-4">
          <input type="hidden" name="token" value={effectiveToken ?? ""} />
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={email ?? ""}
              required
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Nova senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar nova senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={8}
              required
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {message ? (
            <p className="text-sm text-destructive" role="alert">
              {message}
            </p>
          ) : null}
          <SubmitButton className="w-full" loadingText="Atualizando...">
            Atualizar senha
          </SubmitButton>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="underline underline-offset-4">
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
}
