import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { rescheduleAppointment } from "@/api";
import toast from "react-hot-toast";

interface RescheduleDialogProps {
  //   appointment: AppointmentData | null;
  disabled?: boolean;
  uuid: string;
  onRefresh?: () => void;
}

const RescheduleDialog = ({
  disabled,
  uuid,
  onRefresh,
}: RescheduleDialogProps) => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [open, setOpen] = useState(false);
  const handleSubmit = async () => {
    if (uuid) {
      const newStartTime = `${startDate} ${startTime}`;
      const newEndTime = `${startDate} ${endTime}`;
      // onSubmit(appointment.uuid, newStartTime, newEndTime);
      try {
        await rescheduleAppointment(uuid, newStartTime, newEndTime);
        toast.success("Appointment rescheduled successfully!");
      } catch (error) {
        toast.error("Failed to reschedule appointment.");
        console.error(error);
      } finally {
        setOpen(false);
      }
      onRefresh?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <label>Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label>End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
