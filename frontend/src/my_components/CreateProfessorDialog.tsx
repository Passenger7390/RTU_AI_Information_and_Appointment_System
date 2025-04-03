import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import TimeRangePicker from "shadcn-time-range-picker";
import { useState } from "react";
import { createProfessor, Professor } from "@/api";
import toast from "react-hot-toast";
import { IoAddSharp } from "react-icons/io5";

interface CreateProfessorDialogProps {
  onRefresh?: () => void;
}

const CreateProfessorDialog = ({ onRefresh }: CreateProfessorDialogProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function closeForm() {
    setIsDialogOpen(false);
    setWorkingHours("");
    setFirstName("");
    setEmail("");
    setLastName("");
    setTitle("");
  }

  async function saveForm() {
    // Save form logic here
    if (!firstName || !lastName || !email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const params: Professor = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      office_hours: workingHours,
      title: title,
    };
    console.log("params.working_hours", params.office_hours);
    try {
      await createProfessor(params);
      toast.success("Professor created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create professor.");
    } finally {
      onRefresh?.();
      closeForm();
    }
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <IoAddSharp />
          Add New Professor
        </Button>
      </DialogTrigger>
      <DialogContent className="flex-col w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">Professor Profile</DialogTitle>
          <DialogDescription>
            Add new professor profile to the system.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="pb-4">
            <Label className="text-lg font-semibold">Name</Label>
            <Separator />
            <div className="grid grid-cols-5 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="pb-4">
            <Label>
              Email<span className="text-red-500">*</span>
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="text-lg font-semibold">Working Hours</Label>
            <div className="flex justify-center items-center w-full">
              <TimeRangePicker
                initialStartTime="06:00"
                initialEndTime="21:00"
                onTimeRangeChange={(timeRange) => setWorkingHours(timeRange)}
                sort={true}
                showApplyButton={false}
                layout="row"
                startTimeLabel="From"
                endTimeLabel="To"
                step={15}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={closeForm}>Cancel</Button>
          <Button onClick={saveForm}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfessorDialog;
