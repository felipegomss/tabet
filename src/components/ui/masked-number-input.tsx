"use client";

import { Input } from "@/components/ui/input";
import { forwardRef, useState } from "react";

interface MaskedNumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
  suffix?: string; // Ex: "ᙀ" para unidades
  prefix?: string; // Ex: "R$" para dinheiro
  decimals?: number; // casas decimais
}

export const MaskedNumberInput = forwardRef<
  HTMLInputElement,
  MaskedNumberInputProps
>(({ value, onValueChange, suffix, prefix, decimals = 2, ...props }, ref) => {
  const [rawValue, setRawValue] = useState<string>("");

  // formata apenas quando o usuário sai do campo
  const formatNumber = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRawValue(inputValue);

    // limpa prefixo/sufixo e caracteres inválidos
    const cleaned = inputValue
      .replace(prefix ?? "", "")
      .replace(suffix ?? "", "")
      .trim();

    if (!cleaned) {
      onValueChange?.(undefined);
      return;
    }

    const numericPortion = cleaned.replace(/[^0-9.,-]/g, "");
    const hasComma = numericPortion.includes(",");
    const hasDot = numericPortion.includes(".");

    let normalized = numericPortion;
    if (hasComma && hasDot) {
      normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else if (hasComma) {
      normalized = normalized.replace(",", ".");
    }

    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
      onValueChange?.(undefined);
      return;
    }

    const factor = Math.pow(10, decimals);
    const rounded = Math.round(parsed * factor) / factor;
    onValueChange?.(rounded);
  };

  const handleBlur = () => {
    if (value !== undefined && !isNaN(value)) {
      setRawValue(formatNumber(value));
    }
  };

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type="text"
        value={rawValue || (value !== undefined ? formatNumber(value) : "")}
        onChange={handleChange}
        onBlur={handleBlur}
        className={[suffix ? "pr-8" : "", prefix ? "pl-8" : "", props.className]
          .filter(Boolean)
          .join(" ")}
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
