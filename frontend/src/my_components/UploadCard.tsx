// import UploadComponent from "./UploadComponent";
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

  const handleDurationSelect = (value: number) => {
    setDuration(value);
    setSelectedStatus(
      statuses.find((status) => status.value === value) || null
    );
    setOpen(false);
    console.log(duration);
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!duration) return;
    console.log(duration);
    console.log(title);
    try {
      setLoading(true);
      await uploadFile(file, duration, title);
      // TODO: Do a toast in here
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  return (
    <Card>
      <CardHeader className="text-3xl flex justify-center items-center">
        <CardTitle>Upload</CardTitle>
        <CardDescription>
          Upload images or videos to flash on the screen
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-x-10">
        <Label className="font-bold text-md">Title</Label>
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
              <Button variant="outline" className="w-[150px] justify-start">
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
                          console.log(duration);
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
