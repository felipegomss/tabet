import Link from "next/link";

import { SubmitButton } from "@/components/submit-button";
import { sendPasswordResetAction } from "@/lib/auth-actions";
import {
  getFirstSearchParamValue,
  getSafeRedirectPath,
} from "@/utils/navigation";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const message = getFirstSearchParamValue(params.message);
  const status = getFirstSearchParamValue(params.status);
  const redirectTo = getSafeRedirectPath(
    getFirstSearchParamValue(params.redirectTo)
  );

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Recuperar senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Informe seu e-mail para receber um link de redefinição de senha.
          </p>
        </div>
        <form action={sendPasswordResetAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="voce@exemplo.com"
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {redirectTo ? (
            <input type="hidden" name="redirectTo" value={redirectTo} />
          ) : null}
          {message ? (
            <p
              className={`text-sm ${
                status === "error"
                  ? "text-destructive"
                  : status === "success"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              role="status"
            >
              {message}
            </p>
          ) : null}
          <SubmitButton className="w-full" loadingText="Enviando...">
            Enviar link
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
