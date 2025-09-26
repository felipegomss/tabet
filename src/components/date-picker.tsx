"use client";

import { formatInTimeZone } from "date-fns-tz";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

const TIME_ZONE = "UTC";

export function DatePicker({ value, onChange }: DatePickerProps) {
  const formattedDate = React.useMemo(() => {
    if (!value) return null;
    return formatInTimeZone(value, TIME_ZONE, "dd/MM/yyyy");
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground w-[200px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate ?? <span>Selecionar data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          timeZone={TIME_ZONE}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
