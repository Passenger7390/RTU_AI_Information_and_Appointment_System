import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface TimeRangeProps {
  startTime: string;
  endTime: string;
}

interface TimePickerProps {
  onChange?: (timeRange: TimeRangeProps) => void;
  defaultStartHour?: string;
  defaultEndHour?: string;
  defaultStartMinute?: string; // New prop
  defaultEndMinute?: string; // New prop
  defaultStartPeriod?: string;
  defaultEndPeriod?: string;
  className?: string;
  disabled?: boolean;
  // New props for limiting hours
  minHour?: number; // 0-23, 24-hour format
  maxHour?: number; // 0-23, 24-hour format
}

export function TimePicker({
  onChange,
  defaultStartHour = "9",
  defaultEndHour = "5",
  defaultStartMinute = "00", // Default to 00 minutes
  defaultEndMinute = "00", // Default to 00 minutes
  defaultStartPeriod = "AM",
  defaultEndPeriod = "PM",
  className,
  disabled,
  minHour = 0, // Default to full day
  maxHour = 23, // Default to full day
}: TimePickerProps) {
  const [startHour, setStartHour] = useState(defaultStartHour);
  const [startMinute, setStartMinute] = useState(defaultStartMinute); // New state
  const [endHour, setEndHour] = useState(defaultEndHour);
  const [endMinute, setEndMinute] = useState(defaultEndMinute); // New state
  const [startPeriod, setStartPeriod] = useState(defaultStartPeriod);
  const [endPeriod, setEndPeriod] = useState(defaultEndPeriod);

  // Convert hours to 24-hour format for comparison
  const convert24Hour = (hour: string, period: string): number => {
    let hourNum = parseInt(hour);
    if (hour === "12") hourNum = 0; // 12AM is 0, 12PM is 12
    if (period === "PM" && hourNum < 12) hourNum += 12;
    return hourNum;
  };

  // Convert 24-hour format to 12-hour display format
  // const convert12Hour = (hour24: number): [string, string] => {
  //   let hour12 = hour24 % 12;
  //   if (hour12 === 0) hour12 = 12;
  //   const period = hour24 >= 12 ? "PM" : "AM";
  //   return [hour12.toString(), period];
  // };

  // Filter hours based on min/max
  const getAvailableHours = (periodFilter: string) => {
    const baseHours = [
      "12",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
    ];

    return baseHours.filter((hour) => {
      const hour24 = convert24Hour(hour, periodFilter);
      return hour24 >= minHour && hour24 <= maxHour;
    });
  };

  // Available hours for each period
  const amHours = getAvailableHours("AM");
  const pmHours = getAvailableHours("PM");

  // Display logic based on selected period
  // const displayHours = startPeriod === "AM" ? amHours : pmHours;
  // const displayEndHours = endPeriod === "AM" ? amHours : pmHours;

  const minutes = ["00", "15", "30", "45"]; // Common minute intervals
  useEffect(() => {
    if (onChange) {
      onChange({
        startTime: `${startHour}:${startMinute} ${startPeriod}`,
        endTime: `${endHour}:${endMinute} ${endPeriod}`,
      });
    }
  }, [startHour, endHour, startPeriod, endPeriod, onChange]);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Start Time */}
      <div className="mr-4">
        <Label className="text-lg mb-1 block text-center">From</Label>
        <div className="flex">
          <Select value={startHour} onValueChange={setStartHour}>
            <SelectTrigger
              className="w-[80px] text-xl h-15"
              disabled={disabled}
            >
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent className="h-[400px] flex flex-col">
              {(startPeriod === "AM" ? amHours : pmHours).map((hour) => (
                <SelectItem
                  key={`start-${hour}`}
                  value={hour}
                  className="flex justify-center items-center text-lg h-15"
                >
                  <span className="mx-auto">{hour}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={startMinute} onValueChange={setStartMinute}>
            <SelectTrigger
              className="w-[80px] text-xl mx-1 h-15"
              disabled={disabled}
            >
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem
                  key={`start-minute-${minute}`}
                  value={minute}
                  className="flex justify-center items-center text-lg h-15"
                >
                  <span className="mx-auto">{minute}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={startPeriod}
            onValueChange={(value) => setStartPeriod(value as "AM" | "PM")}
          >
            <SelectTrigger
              className="w-[90px] text-xl ml-1 h-15"
              disabled={disabled}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="AM"
                className="flex justify-center items-center text-lg h-15"
              >
                AM
              </SelectItem>
              <SelectItem
                value="PM"
                className="flex justify-center items-center text-lg h-15"
              >
                PM
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* End Time */}
      <div>
        <Label className="text-lg mb-1 block text-center">To</Label>
        <div className="flex">
          <Select value={endHour} onValueChange={setEndHour}>
            <SelectTrigger
              className="w-[80px] text-lg h-15"
              disabled={disabled}
            >
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent className="h-[400px] flex flex-col">
              {(endPeriod === "AM" ? amHours : pmHours).map((hour) => (
                <SelectItem
                  key={`end-${hour}`}
                  value={hour}
                  className="flex justify-center items-center text-lg h-15"
                >
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={endMinute} onValueChange={setEndMinute}>
            <SelectTrigger
              className="w-[80px] text-xl mx-1 h-15"
              disabled={disabled}
            >
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem
                  key={`end-minute-${minute}`}
                  value={minute}
                  className="flex justify-center items-center text-lg h-15"
                >
                  <span className="mx-auto">{minute}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={endPeriod}
            onValueChange={(value) => setEndPeriod(value as "AM" | "PM")}
          >
            <SelectTrigger
              className="w-[90px] text-lg ml-1 h-15"
              disabled={disabled}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {startPeriod === "AM" && (
                <SelectItem
                  value="AM"
                  className="flex justify-center items-center text-lg h-15"
                >
                  AM
                </SelectItem>
              )}
              <SelectItem
                value="PM"
                className="flex justify-center items-center text-lg h-15"
              >
                PM
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
