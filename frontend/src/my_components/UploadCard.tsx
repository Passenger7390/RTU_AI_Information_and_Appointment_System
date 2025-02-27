// import UploadComponent from "./UploadComponent";
import { FaRegCalendarAlt } from "react-icons/fa";
import { format, addDays } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

const UploadCard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(15);
  const [title, setTitle] = useState("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // const handleDurationSelect = (value: number) => {
  //   setDuration(value);
  //   setSelectedStatus(
  //     statuses.find((status) => status.value === value) || null
  //   );
  //   setOpen(false);
  //   console.log(duration);
  // };

  const handleUpload = async () => {
    if (!file) return;
    if (!duration) return;
    if (!title) return;
    if (!date) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    console.log(`${typeof file} ${file}`);
    console.log(`${typeof duration} ${duration}`);
    console.log(`${typeof title} ${title}`);
    console.log(`${typeof formattedDate} ${formattedDate}`);
    try {
      setLoading(true);
      await uploadFile(file, duration, title, formattedDate);
      // TODO: Do a toast in here
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [date, setDate] = useState<Date>();
  return (
    <Card className="w-full">
      <CardHeader className="text-3xl flex justify-center items-center">
        <CardTitle>Upload</CardTitle>
        <CardDescription>
          Upload images or videos to flash on the screen
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-col justify-between align">
        <Label className="font-bold text-md py-56">Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="My Image"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Label className="font-bold text-md">Duration</Label>

        <div className="flex items-center space-x-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start ">
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
        <Label className="font-bold text-md">Expiration</Label>
        <div>
          <Popover>
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
                onSelect={setDate}
                disabled={(date) => date < addDays(new Date(), -1)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-col w-full max-w-lg items-center gap-1.5">
          <Label htmlFor="picture" className="font-bold text-md">
            Image
          </Label>
          <div className="flex">
            <Input id="picture" type="file" onChange={handleFileChange} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={loading} className="w-full">
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UploadCard;
