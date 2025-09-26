"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type AuthSubmitButtonProps = React.ComponentProps<typeof Button> & {
  loadingText?: string;
};

export function AuthSubmitButton({
  children,
  loadingText = "Carregando...",
  disabled,
  ...buttonProps
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      {...buttonProps}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
