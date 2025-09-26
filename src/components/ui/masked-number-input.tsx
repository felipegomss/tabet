"use client";

import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface MaskedNumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number;
  onValueChange?: (value: number) => void;
  suffix?: string; // Ex: "ᙀ" para unidades
  prefix?: string; // Ex: "R$" para dinheiro
  decimals?: number; // casas decimais
}

export const MaskedNumberInput = forwardRef<
  HTMLInputElement,
  MaskedNumberInputProps
>(({ value, onValueChange, suffix, prefix, decimals = 2, ...props }, ref) => {
  const format = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type="text"
        value={value !== undefined && !isNaN(value) ? format(value) : ""}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "");
          const parsed = parseFloat(raw) / Math.pow(10, decimals);
          onValueChange?.(isNaN(parsed) ? 0 : parsed);
        }}
        className={suffix ? "pr-8" : prefix ? "pl-8" : ""}
      />
      {suffix && (
        <span className="absolute inset-y-0 right-2 flex items-center text-muted-foreground pointer-events-none">
          {suffix}
        </span>
      )}
      {prefix && (
        <span className="absolute inset-y-0 left-2 flex items-center text-muted-foreground pointer-events-none">
          {prefix}
        </span>
      )}
    </div>
  );
});

MaskedNumberInput.displayName = "MaskedNumberInput";
