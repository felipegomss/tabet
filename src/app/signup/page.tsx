import { SignupForm } from "@/components/signup-form";
import {
  getFirstSearchParamValue,
  getSafeRedirectPath,
} from "@/utils/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

interface SignupPageProps {
  searchParams?: Promise<{
    message?: string | string[];
    redirectTo?: string | string[];
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};
  const message = getFirstSearchParamValue(params.message);
  const redirectTo = getSafeRedirectPath(
    getFirstSearchParamValue(params.redirectTo)
  );

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Tabet.
        </Link>
        <SignupForm message={message} redirectTo={redirectTo} />
      </div>
    </div>
  );
}
