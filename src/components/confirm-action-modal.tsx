"use client";

import { SubmitButton } from "@/components/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { MaskedNumberInput } from "./ui/masked-number-input";

interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  actionLabel: string;
  description?: string;
  requireCashoutValue?: boolean;
  onConfirm: (value?: number) => void;
}

export function ConfirmActionModal({
  open,
  onClose,
  actionLabel,
  description,
  requireCashoutValue,
  onConfirm,
}: ConfirmActionModalProps) {
  const [cashoutValue, setCashoutValue] = useState("");

  const handleClose = () => {
    setCashoutValue("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogDescription>
            {description ?? `Deseja realmente executar "${actionLabel}"?`}
          </DialogDescription>
        </DialogHeader>

        {requireCashoutValue && (
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">
              Valor bruto do Cashout
            </label>
            <MaskedNumberInput
              value={cashoutValue === "" ? undefined : Number(cashoutValue)}
              onValueChange={(value) =>
                setCashoutValue(value === undefined ? "" : value.toString())
              }
              prefix="R$"
              decimals={2}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <SubmitButton type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </SubmitButton>
          <SubmitButton
            type="button"
            onClick={() => {
              if (requireCashoutValue) {
                const num = Number(cashoutValue);
                if (isNaN(num)) {
                  return;
                }
                onConfirm(num);
                handleClose();
              } else {
                onConfirm();
                handleClose();
              }
            }}
          >
            Confirmar
          </SubmitButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
