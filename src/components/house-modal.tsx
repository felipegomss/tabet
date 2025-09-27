"use client";

import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
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
import { saveUserHouses } from "@/lib/user-settings-actions";
import { useUserSettings } from "@/providers/user-settings-provider";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface HouseModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function normalizeInput(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function HouseModal({ open, onOpenChange }: HouseModalProps) {
  const { userId, stakeValue, bettingHouses, setBettingHouses } =
    useUserSettings();
  const [loading, setLoading] = useState(false);
  const [newHouse, setNewHouse] = useState("");
  const [draft, setDraft] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setDraft(bettingHouses);
      setNewHouse("");
    }
  }, [open, bettingHouses]);

  const hasChanges = useMemo(() => {
    if (draft.length !== bettingHouses.length) return true;
    return draft.some((house, index) => house !== bettingHouses[index]);
  }, [draft, bettingHouses]);

  const addHouse = () => {
    const normalized = normalizeInput(newHouse);
    if (!normalized) return;

    const exists = draft.some(
      (house) =>
        house.localeCompare(normalized, "pt-BR", { sensitivity: "base" }) === 0
    );

    if (exists) {
      setNewHouse("");
      return;
    }

    setDraft((prev) => [...prev, normalized]);
    setNewHouse("");
  };

  const removeHouse = (house: string) => {
    setDraft((prev) => prev.filter((item) => item !== house));
  };

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const updated = await saveUserHouses(userId, draft, stakeValue);
      setBettingHouses(updated);
      onOpenChange?.(false);
    } catch (error) {
      console.error("❌ Erro ao salvar casas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Gerenciar Casas</DialogTitle>
          <DialogDescription>
            Adicione ou remova casas de aposta preferidas. Elas aparecerão nos
            formulários para facilitar o preenchimento.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium">Nova casa</label>
              <Input
                value={newHouse}
                placeholder="Digite o nome da casa"
                onChange={(event) => setNewHouse(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addHouse();
                  }
                }}
                disabled={loading}
              />
            </div>
            <Button
              type="button"
              onClick={addHouse}
              className="mt-auto"
              disabled={!normalizeInput(newHouse) || loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Casas cadastradas</label>
            {draft.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma casa cadastrada até o momento.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {draft.map((house) => (
                  <li key={house}>
                    <Button
                      type="button"
                      variant="secondary"
                      className="group flex items-center gap-2"
                      onClick={() => removeHouse(house)}
                      disabled={loading}
                    >
                      <span>{house}</span>
                      <Trash2 className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <SubmitButton
            type="button"
            onClick={() => {
              if (!loading) {
                void handleSave();
              }
            }}
            isLoading={loading}
            loadingText="Salvando..."
            className="w-full"
            disabled={!hasChanges}
          >
            Salvar casas
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
