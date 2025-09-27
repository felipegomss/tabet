import { LoginForm } from "@/components/login-form";
import {
  getFirstSearchParamValue,
  getSafeRedirectPath,
} from "@/utils/navigation";
import { IconInnerShadowTop } from "@tabler/icons-react";

type LoginPageProps = {
  searchParams?: Promise<{
    message?: string | string[];
    redirectTo?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const message = getFirstSearchParamValue(params.message);
  const redirectTo = getSafeRedirectPath(
    getFirstSearchParamValue(params.redirectTo)
  );

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <IconInnerShadowTop className="!size-5" />
          </div>
          <span>
            Ta<span className="text-primary">bet.</span>
          </span>
        </a>
        <LoginForm message={message} redirectTo={redirectTo} />
      </div>
    </div>
  );
}
