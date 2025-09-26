import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signupAction } from "@/lib/auth-actions";
import { getSafeRedirectPath } from "@/utils/navigation";
import Link from "next/link";

interface SignupFormProps extends React.ComponentProps<"div"> {
  message?: string;
  redirectTo?: string;
}

export function SignupForm({ className, message, redirectTo, ...props }: SignupFormProps) {
  const safeRedirect = getSafeRedirectPath(redirectTo);
  const signupWithRedirect = signupAction.bind(null, safeRedirect);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crie sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signupWithRedirect} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Maria Silva"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {message ? (
              <p className="text-sm text-destructive" role="alert">
                {message}
              </p>
            ) : null}
            <SubmitButton className="w-full" loadingText="Cadastrando...">
              Cadastrar
            </SubmitButton>
          </form>
          <div className="text-center text-sm mt-6">
            Já tem uma conta?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
