"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

const bettingHouses = [
  { value: "Superbet", label: "Superbet" },
  { value: "Betfast", label: "Betfast" },
  { value: "Bet7k", label: "Bet7k" },
  { value: "Bet365", label: "Bet365" },
  { value: "Esportiva", label: "Esportiva" },
];

export function HouseSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Exibe o valor selecionado ou digitado
  const displayLabel =
    bettingHouses.find((house) => house.value === value)?.label || value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayLabel || "Selecione a casa..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="end">
        <Command>
          <CommandInput
            placeholder="Buscar ou digitar..."
            className="h-9"
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onChange(inputValue);
                  setInputValue(inputValue);
                  setOpen(false);
                }}
              >
                Usar "{inputValue}"
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {bettingHouses.map((house) => (
                <CommandItem
                  key={house.value}
                  value={house.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setInputValue("");
                    setOpen(false);
                  }}
                >
                  {house.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === house.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
