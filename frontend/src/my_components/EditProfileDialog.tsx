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
import { getProfessorById, updateProfessorAPI } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";

const EditProfileDialog = ({
  disabled,
  professor_uuid,
  onRefresh,
}: EditProfileDialogProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [officeHours, setOfficeHours] = useState("");
  const [newOfficeHours, setNewOfficeHours] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [originalValues, setOriginalValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
  });

  async function fetchProfessorById() {
    try {
      setIsLoading(true);
      const res = await getProfessorById(professor_uuid);
      if (res) {
        setFirstName(res.first_name);
        setLastName(res.last_name);
        setEmail(res.email);
        setTitle(res.title);
        setOfficeHours(res.office_hours);

        setOriginalValues({
          firstName: res.first_name,
          lastName: res.last_name,
          email: res.email,
          title: res.title,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed fetching professor's data");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfessor() {
    try {
      const updatedData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        title: title,
        office_hours: newOfficeHours,
      };

      const res = await updateProfessorAPI(professor_uuid, updatedData);
      if (res) {
        toast.success(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update professor's profile");
    } finally {
      setIsDialogOpen(false);
      onRefresh?.();
    }
  }

  useEffect(() => {
    if (professor_uuid) {
      fetchProfessorById();
    }
  }, [professor_uuid]);

  useEffect(() => {
    const hasChanges =
      firstName !== originalValues.firstName ||
      lastName !== originalValues.lastName ||
      email !== originalValues.email ||
      title !== originalValues.title ||
      officeHours !== newOfficeHours;

    setIsChanged(hasChanges);
  }, [firstName, lastName, email, title, newOfficeHours, originalValues]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        {isLoading ? (
          <Skeleton className="h-20 max-w-[75%]" />
        ) : (
          <>
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
                <Label className="text-lg font-semibold">
                  Working Hours<span className="text-red-500">*</span>
                </Label>
                <div className="flex justify-center items-center w-full">
                  <TimeRangePicker
                    initialStartTime={officeHours.split("-")[0]}
                    initialEndTime={officeHours.split("-")[1]}
                    onTimeRangeChange={(timeRange) =>
                      setNewOfficeHours(timeRange)
                    }
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
              <Button onClick={updateProfessor} disabled={!isChanged}>
                Update
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
