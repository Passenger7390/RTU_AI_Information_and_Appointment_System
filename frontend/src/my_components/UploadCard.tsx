// import UploadComponent from "./UploadComponent";
import { FaRegCalendarAlt } from "react-icons/fa";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { uploadFile } from "@/api";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import axios from "axios";

type Status = {
  value: number;
  label: string;
};

const statuses: Status[] = [
  {
    value: 15,
    label: "15",
  },
  {
    value: 30,
    label: "30",
  },
  {
    value: 45,
    label: "45",
  },
];

interface UploadCardProps {
  onUploadComplete?: () => void;
}

const UploadCard = ({ onUploadComplete }: UploadCardProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(15);
  const [title, setTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openExpiration, setOpenExpiration] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDuration(15);
    setDate(undefined);
    setSelectedStatus(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!duration) return;
    if (!title) return;
    if (!date) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    try {
      setLoading(true);
      await uploadFile(file, duration, title, formattedDate);
      // TODO: Do a toast in here
      onUploadComplete?.(); // Refresh table data after successful upload
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`${error.response?.data?.detail || "Upload failed"}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [date, setDate] = useState<Date>();
  return (
    <>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
            setDialogOpen(open);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            Upload
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload</DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="My Image"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiration" className="text-right">
                Expiration
              </Label>
              <Popover open={openExpiration} onOpenChange={setOpenExpiration}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <FaRegCalendarAlt className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      setOpenExpiration(false);
                    }}
                    disabled={(date) => date < addDays(new Date(), -1)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[150px] justify-start "
                  >
                    {selectedStatus ? (
                      <>{selectedStatus.label}</>
                    ) : (
                      <>Set duration</>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {statuses.map((status) => (
                          <CommandItem
                            key={status.value}
                            value={status.value.toString()}
                            onSelect={(value) => {
                              setDuration(parseInt(value));
                              setSelectedStatus(
                                statuses.find(
                                  (status) => status.value === parseInt(value)
                                ) || null
                              );
                              setOpen(false);
                            }}
                          >
                            {status.label} seconds
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input
                id="picture"
                type="file"
                onChange={handleFileChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadCard;
