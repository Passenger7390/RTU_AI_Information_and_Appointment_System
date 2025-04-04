import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import TimeRangePicker from "shadcn-time-range-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EditProfileDialogProps } from "@/interface";
import { getProfessorById } from "@/api";

const EditProfileDialog = ({
  disabled,
  professor_uuid,
}: EditProfileDialogProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [officeHours, setOfficeHours] = useState("dawg");

  async function fetchProfessorById() {
    try {
      const res = await getProfessorById(professor_uuid);
      console.log("res", res);
      if (res) {
        setFirstName(res.first_name);
        setLastName(res.last_name);
        setEmail(res.email);
        setTitle(res.title);
        setOfficeHours(res.office_hours); // Not assigning value
      }
      console.log(officeHours);
    } catch (error) {
      toast.error("Failed fetching professor's data");
    }
  }

  async function updateProfessor() {}

  useEffect(() => {
    fetchProfessorById();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Professor's Profile</DialogTitle>
          <DialogDescription>
            Update the professor's profile information here.
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
                onTimeRangeChange={(timeRange) => setOfficeHours(timeRange)}
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
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
