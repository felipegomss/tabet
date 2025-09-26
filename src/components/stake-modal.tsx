"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { saveStakeAction } from "@/lib/stake-actions";
import { formatCurrency, parseCurrency } from "@/lib/utils";
import { SubmitButton } from "@/components/submit-button";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StakeModalProps {
  defaultValue: number | null;
  userId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function StakeModal({
  defaultValue,
  userId,
  open,
  onOpenChange,
}: StakeModalProps) {
  const [value, setValue] = useState(
    defaultValue ? formatCurrency(defaultValue) : ""
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (raw: string) => {
    const clean = raw.replace(/\D/g, "");

    const number = Number(clean) / 100;
    setValue(formatCurrency(number));
  };

  const saveStake = async () => {
    if (!userId || !value) return;
    setLoading(true);

    try {
      const clean = parseCurrency(value);
      await saveStakeAction(userId, clean);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Definir Stake Padrão</DialogTitle>
          <DialogDescription>
            O valor da sua stake será usado como referência para calcular suas
            apostas e lucros. Você poderá alterar isso depois.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="space-y-2">
          <label className="text-sm font-medium">Stake (R$)</label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="R$ 50,00"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" />
            Esse valor não limita suas apostas, é apenas uma base.
          </p>
        </div>

        <DialogFooter className="mt-4">
          <SubmitButton
            type="button"
            onClick={() => {
              if (!loading) {
                void saveStake();
              }
            }}
            disabled={!value}
            isLoading={loading}
            loadingText="Salvando..."
            className="w-full"
          >
            Salvar Stake
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
