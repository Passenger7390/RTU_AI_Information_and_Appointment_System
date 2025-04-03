import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface CalendarComponentProps {
  getDate?: (date: Date) => void;
  disabled?: boolean;
}

export const MyCalendar = ({ getDate, disabled }: CalendarComponentProps) => {
  const [date, setDate] = useState<Date>();

  function onDateSelect(selectedDate: Date | undefined) {
    if (selectedDate) {
      // Only call getDate if it's provided
      if (getDate) {
        getDate(selectedDate);
      }
      setDate(selectedDate);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal text-2xl p-5",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          initialFocus
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};
