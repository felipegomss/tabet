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

export function HouseSelect({
  value,
  onChange,
  houses,
}: {
  value: string;
  onChange: (value: string) => void;
  houses: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const displayLabel = houses.find((h) => h === value) || value;

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
              {inputValue ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onChange(inputValue);
                    setInputValue("");
                    setOpen(false);
                  }}
                >
                  Usar &quot;{inputValue}&quot;
                </Button>
              ) : (
                <p className="text-center text-xs text-muted-foreground">
                  Nenhuma casa encontrada,
                  <br />
                  digite para adicionar
                </p>
              )}
            </CommandEmpty>
            <CommandGroup>
              {houses.map((house) => (
                <CommandItem
                  key={house}
                  value={house}
                  onSelect={() => {
                    onChange(house);
                    setInputValue("");
                    setOpen(false);
                  }}
                >
                  {house}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === house ? "opacity-100" : "opacity-0"
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
