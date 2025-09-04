import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, parseISODate, toISODate } from "@/utils/dateFormat";

interface DatePickerFieldProps {
  id?: string;
  value?: string; // ISO yyyy-MM-dd or empty
  onChange: (isoDate: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePickerField({ id, value, onChange, placeholder, className, disabled }: DatePickerFieldProps) {
  const { t } = useTranslation();
  const defaultPlaceholder = placeholder || t('datePicker.selectDate');
  const selected = React.useMemo(() => parseISODate(value || undefined) || undefined, [value]);

  const handleSelect = (date?: Date) => {
    if (!date) return;
    onChange(toISODate(date));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? formatDate(selected) : <span>{defaultPlaceholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
