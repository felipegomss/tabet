import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { getSafeRedirectPath } from "@/utils/navigation";
import Link from "next/link";

type LoginFormProps = React.ComponentProps<"div"> & {
  message?: string;
  redirectTo?: string;
};

export function LoginForm({
  className,
  message,
  redirectTo,
  ...props
}: LoginFormProps) {
  const safeRedirect = getSafeRedirectPath(redirectTo);
  const loginWithRedirect = loginAction.bind(null, safeRedirect);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo(a) de volta</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={loginWithRedirect} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
            </div>
            {message ? (
              <p className="text-sm text-destructive" role="alert">
                {message}
              </p>
            ) : null}
            <SubmitButton className="w-full" loadingText="Entrando...">
              Entrar
            </SubmitButton>
          </form>
          <div className="text-center text-sm mt-6">
            Novo por aqui?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
