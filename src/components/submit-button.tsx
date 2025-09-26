"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { ComponentProps } from "react";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  loadingText?: string;
  isLoading?: boolean;
  resetPending?: () => void;
};

export function SubmitButton({
  children,
  loadingText = "Carregando...",
  isLoading,
  disabled,
  type,
  resetPending,
  onClick,
  ...buttonProps
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const showLoading = isLoading ?? pending;

  return (
    <Button
      type={type ?? "submit"}
      disabled={showLoading || disabled}
      aria-busy={showLoading}
      onClick={(event) => {
        if (resetPending && !pending) {
          resetPending();
        }
        onClick?.(event);
      }}
      {...buttonProps}
    >
      {showLoading ? (
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
