import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TimePickerProps } from "@/interface";
import toast from "react-hot-toast";

export function TimePicker({
  onChange,
  defaultStartHour = "9",
  defaultEndHour = "5",
  defaultStartPeriod = "AM",
  defaultEndPeriod = "PM",
  className,
  disabled,
  minHour = 0, // Default to full day
  maxHour = 23, // Default to full day
  scheduled = [],
}: TimePickerProps) {
  const [startHour, setStartHour] = useState(defaultStartHour);
  const [endHour, setEndHour] = useState(defaultEndHour);
  const [startPeriod, setStartPeriod] = useState(defaultStartPeriod);
  const [endPeriod, setEndPeriod] = useState(defaultEndPeriod);

  // Convert hours to 24-hour format for comparison
  const convert24Hour = (hour: string, period: string): number => {
    let hourNum = parseInt(hour);
    if (hour === "12") hourNum = 0; // 12AM is 0, 12PM is 12
    if (period === "PM" && hourNum < 12) hourNum += 12;
    return hourNum;
  };

  // Function to check if a particular hour is booked
  const isTimeSlotBooked = (hour: string, period: string): boolean => {
    const hour24 = convert24Hour(hour, period);

    // Check if this hour falls within any of the booked time ranges
    return scheduled.some((slot) => {
      // Extract hours from the time strings
      const startHour = parseInt(slot.start_time.split(":")[0]);
      const endHour = parseInt(slot.end_time.split(":")[0]);

      // Check if hour24 falls within this booked range (inclusive of start, exclusive of end)
      return hour24 >= startHour && hour24 < endHour;
    });
  };

  // NEW FUNCTION: Check if selecting this end time would create an overlapping appointment
  const wouldOverlapAppointment = (
    endHour: string,
    endPeriod: string
  ): boolean => {
    const start24 = convert24Hour(startHour, startPeriod);
    const end24 = convert24Hour(endHour, endPeriod);

    // Make sure the end time is after the start time
    if (end24 <= start24) return true;

    // Check if the appointment range would overlap with any scheduled appointment
    return scheduled.some((slot) => {
      // Convert time strings to 24-hour format numbers
      const slotStart = parseInt(slot.start_time.split(":")[0]);
      const slotEnd = parseInt(slot.end_time.split(":")[0]);

      // For the appointment from start24 to end24:

      // Case 1: Appointment ends exactly when a booked slot starts (this is OK)
      // 12PM-1PM doesn't overlap with 1PM-3PM
      if (end24 === slotStart) return false;

      // Case 2: Appointment starts exactly when a booked slot ends (this is OK)
      // 12PM-1PM doesn't overlap with 11AM-12PM
      if (start24 === slotEnd) return false;

      // Case 3: Check for any other overlap
      // - Start time falls within a booked slot
      const startInside = start24 >= slotStart && start24 < slotEnd;

      // - End time falls within a booked slot
      const endInside = end24 > slotStart && end24 <= slotEnd;

      // - Appointment fully contains a booked slot
      const contains = start24 <= slotStart && end24 >= slotEnd;

      return startInside || endInside || contains;
    });
  };

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

  const isStartTimeBeforeEndTime = (): boolean => {
    // Convert both times to 24-hour format for comparison
    const start24 = convert24Hour(startHour, startPeriod);
    const end24 = convert24Hour(endHour, endPeriod);

    // Return true if start time is before end time
    return start24 < end24;
  };

  // Update parent component when time changes
  useEffect(() => {
    if (onChange) {
      // Check if time is valid
      if (!isStartTimeBeforeEndTime()) {
        // Option 1: Show error message
        toast.error("End time must be after start time");

        // Option 2: Auto-correct by adjusting end time
        // If in same period, make end hour later
        if (
          startPeriod === endPeriod &&
          parseInt(startHour) >= parseInt(endHour)
        ) {
          const newHour = Math.min(12, parseInt(startHour) + 1).toString();
          setEndHour(newHour);
          return; // Wait for next render cycle
        }
        // If AM to PM transition, this is fine
        // If PM to AM, adjust to same day PM
        else if (startPeriod === "PM" && endPeriod === "AM") {
          setEndPeriod("PM");
          return; // Wait for next render cycle
        }
      }

      // If we get here, times are valid
      onChange({
        startTime: `${startHour}:00 ${startPeriod}`,
        endTime: `${endHour}:00 ${endPeriod}`,
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
              {(startPeriod === "AM" ? amHours : pmHours).map((hour) => {
                const isBooked = isTimeSlotBooked(hour, startPeriod);
                return (
                  <SelectItem
                    key={`start-${hour}`}
                    value={hour}
                    className={`flex justify-center items-center text-lg h-15 ${
                      isBooked ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isBooked}
                  >
                    <span className="mx-auto">{hour}</span>
                  </SelectItem>
                );
              })}
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
              {(endPeriod === "AM" ? amHours : pmHours).map((hour) => {
                const isBooked = isTimeSlotBooked(hour, endPeriod);
                const wouldOverlap = wouldOverlapAppointment(hour, endPeriod);
                return (
                  <SelectItem
                    key={`end-${hour}`}
                    value={hour}
                    className={`flex justify-center items-center text-lg h-15 ${
                      isBooked || wouldOverlap
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={isBooked || wouldOverlap}
                  >
                    {hour}
                  </SelectItem>
                );
              })}
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
