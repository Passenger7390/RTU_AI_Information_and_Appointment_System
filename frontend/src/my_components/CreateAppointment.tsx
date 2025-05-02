import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import OTPDialog from "./OTPDialog";
import toast from "react-hot-toast";
import { KeyboardInput } from "./KeyboardInput";
import { KeyboardTextArea } from "./KeyboardTextArea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createAppointment,
  getAppointmentSchedule,
  getProfessors,
} from "@/api";
import { MyCalendar } from "./myCalendar";
import { TimePicker } from "./timePicker";
import { IoMdClose } from "react-icons/io";
import {
  Appointment,
  PersonalInfoPageProps,
  ProfessorInfoPageProps,
  ProfessorList,
  VerifyInfoDialogProps,
} from "@/interface";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const CreateAppointmentComponent = ({ onBack }: { onBack: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // State to track success

  const totalPages = 3;

  const [studentInfoPage, setStudentInfoPage] = useState({
    student_name: "",
    student_id: "",
    student_email: "",
    concern: "",
    isEmailVerified: false,
  });

  const [professorInfoPage, setProfessorInfoPage] = useState({
    professor_uuid: "",
    start_time: "",
    end_time: "",
    isDateValid: false,
    isTimeValid: false,
    professorName: "",
  });

  const [verifyInfoPage, setVerifyInfoPage] = useState<Appointment>();

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <PersonalInfoPage
            setStudentInformation={setStudentInfoPage}
            initialData={{
              student_name: studentInfoPage.student_name,
              student_id: studentInfoPage.student_id,
              student_email: studentInfoPage.student_email,
              concern: studentInfoPage.concern,
              isEmailVerified: studentInfoPage.isEmailVerified,
            }}
          />
        );
      case 1:
        return (
          <ProfessorInfoPage
            setStudentInformation={setProfessorInfoPage}
            initialData={{
              professor_uuid: professorInfoPage.professor_uuid,
              start_time: professorInfoPage.start_time,
              end_time: professorInfoPage.end_time,
              isDateValid: professorInfoPage.isDateValid,
              isTimeValid: professorInfoPage.isTimeValid,
            }}
          />
        );
      case 2:
        return (
          <VerifyInformationPage
            data={verifyInfoPage}
            professorName={professorInfoPage.professorName}
          />
        );
      default:
        return (
          <PersonalInfoPage
            setStudentInformation={setStudentInfoPage}
            initialData={{
              student_name: studentInfoPage.student_name,
              student_id: studentInfoPage.student_id,
              student_email: studentInfoPage.student_email,
              concern: studentInfoPage.concern,
              isEmailVerified: studentInfoPage.isEmailVerified,
            }}
          />
        );
    }
  };

  const nextPage = () => {
    if (currentPage === 0) {
      if (
        !studentInfoPage ||
        !studentInfoPage.student_name ||
        !studentInfoPage.student_id ||
        !studentInfoPage.concern ||
        !studentInfoPage.student_email
      ) {
        toast.error("Please fill out the form before proceeding.");
        return;
      }
      if (!studentInfoPage.isEmailVerified) {
        toast.error("Please verify your email before proceeding.");
        return;
      }
    }

    if (currentPage === 1) {
      if (professorInfoPage.isDateValid && professorInfoPage.isTimeValid) {
        setVerifyInfoPage({
          student_name: studentInfoPage.student_name,
          student_id: studentInfoPage.student_id,
          student_email: studentInfoPage.student_email,
          professor_uuid: professorInfoPage.professor_uuid,
          concern: studentInfoPage.concern,
          start_time: professorInfoPage.start_time,
          end_time: professorInfoPage.end_time,
        });
      } else {
        toast.error("Please select a valid date and time.");
        return;
      }
    }

    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      onBack();
    }
  };

  async function submitForm() {
    if (currentPage === totalPages - 1) {
      // Submit the form data
      if (!verifyInfoPage) {
        toast.error("Please fill out the form before proceeding.");
        return;
      }

      try {
        const res = await createAppointment(verifyInfoPage);
        toast.success(`${res.message}`);
        setReferenceNumber(res.reference);
        setIsSuccess(true); // Set success state to true
      } catch (error: any) {
        console.error("Error creating appointment:", error);
        const errorMessage =
          error.response?.data?.detail || "Error creating appointment";
        toast.error(errorMessage);
      }
    }
  }

  return (
    <div>
      {!isSuccess ? (
        <Card className="max-w-full max-h-full min-w-[fit-content] min-h-[fit-content] py-5">
          <CardHeader className="flex-row items-center w-full">
            <div className="flex-1 items-center">
              <CardTitle className="flex text-5xl mx-auto justify-center flex-1 pl-18">
                Create Appointment
              </CardTitle>
            </div>
            <div className="flex items-center">
              <Button
                onClick={onBack}
                variant={"ghost"}
                className="hover:bg-transparent hover:shadow-none hover:text-current flex-1 size-20"
              >
                <IoMdClose className="size-18" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {renderPage()}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              onClick={prevPage}
              variant={"secondary"}
              className="text-2xl h-full w-64"
            >
              {currentPage === 0 ? "Cancel" : "Back"}
            </Button>
            <Button
              onClick={currentPage === totalPages - 1 ? submitForm : nextPage}
              className="text-2xl h-full w-64"
            >
              {currentPage === totalPages - 1 ? "Submit" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <ReferenceNumberCard referenceNumber={referenceNumber} />
      )}
    </div>
  );
};

const PersonalInfoPage = ({
  setStudentInformation,
  initialData,
}: PersonalInfoPageProps) => {
  const [studentID, setStudentID] = useState(initialData.student_id);
  const [studentName, setStudentName] = useState(initialData.student_name);
  const [concern, setConcern] = useState(initialData.concern);
  const [emailVerified, setEmailVerified] = useState(
    initialData.isEmailVerified
  );
  // Handle the pagination

  const onEmailVerified = () => {
    setEmailVerified(true);
  };
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setStudentInformation({
      student_name: studentName,
      student_id: studentID,
      // student_email: `${studentID}@rtu.edu.ph`,
      student_email: `${studentID}`,
      concern,
      isEmailVerified: emailVerified,
    });
  }, [studentName, studentID, concern, emailVerified, setStudentInformation]);

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full w-[1000px]">
      <div className="p-10 space-y-5 grid gap-4 items-center w-[1000px]">
        <div className="grid gap-5 grid-cols-6">
          <Label className="text-3xl text-right">Name</Label>
          <KeyboardInput
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            keyboardType="alphanumeric"
            className="!text-xl col-span-5"
            required
          />
        </div>
        <div className="grid gap-5 grid-cols-6">
          <Label className="text-3xl text-right">Email</Label>
          <div className="flex col-span-4 gap-1">
            <KeyboardInput
              type="email"
              value={studentID}
              onChange={(e) => {
                setStudentID(e.target.value);
                setEmailVerified(false);
              }}
              keyboardType="alphanumeric"
              className="!text-xl flex-1"
            />
            <Label className="text-xl">@rtu.edu.ph</Label>
          </div>
          <OTPDialog
            // email={`${studentID}@rtu.edu.ph`}
            email={`${studentID}`}
            onVerified={onEmailVerified}
            key={studentID}
          />
        </div>
        <div className="grid gap-5 grid-cols-6">
          <Label className="text-3xl text-right flex-1">Concern</Label>
          {/* <Textarea
              placeholder="Type your concern here."
              maxLength={500}
              className="max-w-[64rem] !text-xl col-span-5 max-h-36 overflow-x-hidden resize-none"
              required
            /> */}
          <KeyboardTextArea
            placeholder="Type your concern here."
            maxLength={500}
            className="max-w-[64rem] !text-xl col-span-5 max-h-36 overflow-x-hidden resize-none"
            required
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            keyboardType="alphanumeric"
          />
        </div>
      </div>
    </div>
  );
};

const ProfessorInfoPage = ({
  setStudentInformation,
  initialData,
}: ProfessorInfoPageProps) => {
  const [title, setTitle] = useState("Select Professor");
  const [professor, setProfessor] = useState<ProfessorList>();
  const [professorList, setProfessorList] = useState<ProfessorList[]>([]);
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchText, setSearchText] = useState("");

  async function fetchProfessors() {
    try {
      const res = await getProfessors();
      setProfessorList(res);
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  }

  function formatHours() {
    // This will be used in label in office hours
    if (professor?.office_hours) {
      const hours = professor.office_hours.split("-");
      const start = new Date(`1970-01-01T${hours[0]}:00`);
      const end = new Date(`1970-01-01T${hours[1]}:00`);

      return `${start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return "";
  }

  function getStartHour() {
    if (professor?.office_hours) {
      const hours = professor.office_hours.split("-");

      const hourNumeric = parseInt(hours[0].split(":")[0], 10);
      const hourNumeric12 = hourNumeric > 12 ? hourNumeric - 12 : hourNumeric;

      const startHour = hourNumeric12.toString();
      const startMinute = hours[0].split(":")[1];
      const startPeriod = hourNumeric > 12 ? "PM" : "AM";

      return [startHour, startMinute, startPeriod];
    }
    return ["6", "00", "AM"];
  }

  function getEndHour() {
    if (professor?.office_hours) {
      const hours = professor.office_hours.split("-");

      const hourNumeric = parseInt(hours[1].split(":")[0], 10);
      const hourNumeric12 = hourNumeric > 12 ? hourNumeric - 12 : hourNumeric;
      const endHour = hourNumeric12.toString();

      const endMinute = hours[1].split(":")[1];
      const endPeriod = hourNumeric > 12 ? "PM" : "AM";

      return [endHour, endMinute, endPeriod];
    }
    return ["6", "00", "PM"];
  }

  function handleSelectorChange(id: string) {
    const selectedProfessor = professorList.find(
      (professor) => professor.professor_id === id
    );
    setTitle(selectedProfessor?.name || "Select Professor");
    setProfessor(selectedProfessor);
  }

  function getOfficeHoursRange() {
    if (professor?.office_hours) {
      const hours = professor.office_hours.split("-");

      // Parse start hour
      const startParts = hours[0].split(":");
      let startHour = parseInt(startParts[0], 10);
      if (startParts[0].includes("PM") && startHour < 12) startHour += 12;

      // Parse end hour
      const endParts = hours[1].split(":");
      let endHour = parseInt(endParts[0], 10);
      if (endParts[1].includes("PM") && endHour < 12) endHour += 12;

      return { minHour: startHour, maxHour: endHour };
    }
    return { minHour: 0, maxHour: 23 }; // Default to full day
  }
  const officeHoursRange = getOfficeHoursRange();

  useEffect(() => {
    fetchProfessors();
  }, []);

  useEffect(() => {
    setStudentInformation({
      professor_uuid: professor?.professor_id || "",
      start_time: `${date} ${hours.split("-")[0]}`,
      end_time: `${date} ${hours.split("-")[1]}`,
      isDateValid: date !== "",
      isTimeValid: hours !== "",
      professorName: professor?.name || "",
    });
  }, [professor, date, hours, setStudentInformation]);

  useEffect(() => {
    // Only run this if we have both the professor list and an initial ID
    if (initialData?.professor_uuid && professorList.length > 0) {
      // Find the professor object matching the ID
      const initialProfessor = professorList.find(
        (prof) => prof.professor_id === initialData.professor_uuid
      );

      if (initialProfessor) {
        setProfessor(initialProfessor);
        setTitle(initialProfessor.name); // Update dropdown title too
      }
    }
  }, [initialData.professor_uuid, professorList]);

  useEffect(() => {
    async function getAppointmentScheduleOfProfessor() {
      if (professor) {
        try {
          const res = await getAppointmentSchedule(
            professor.professor_id,
            date
          );
          setBookedSlots(res);
        } catch (error) {
          console.error("Error fetching professors:", error);
        }
      }
    }
    getAppointmentScheduleOfProfessor();
  }, [professor, date]);

  // 1. Add a ref for the keyboard container
  const keyboardContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full w-[1000px]">
      <div className="w-full px-5 mb-10">
        <Label className="text-2xl font-semibold">Professor Schedule</Label>
        <div className="w-full flex gap-4 item-center justify-center h-20">
          <Popover
            open={open}
            onOpenChange={(isOpen) => {
              // Only close if it's not a click inside the keyboard
              if (!isOpen && keyboardContainerRef.current) {
                // Check if the active element is within the keyboard or our input
                const keyboardIsActive = document.activeElement?.closest(
                  ".keyboard-container"
                );
                if (keyboardIsActive) {
                  // Don't close the popover if we're interacting with the keyboard
                  return;
                }
              }
              setOpen(isOpen);
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="text-2xl p-5 w-full flex items-center my-auto justify-between"
              >
                {value
                  ? professorList.find((prof) => prof.professor_id === value)
                      ?.name
                  : "Select professor..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <div
                  className="px-1 py-2 keyboard-container"
                  ref={keyboardContainerRef}
                >
                  <KeyboardInput
                    type="text"
                    placeholder="Search professor..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    keyboardType="alphanumeric"
                    className="h-9 w-full text-base"
                  />
                </div>
                <CommandList>
                  <CommandEmpty>No professor found.</CommandEmpty>
                  <CommandGroup>
                    {professorList
                      .filter((prof) =>
                        prof.name
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      )
                      .map((prof) => (
                        <CommandItem
                          key={prof.professor_id}
                          value={prof.name}
                          onSelect={() => {
                            setValue(
                              value === prof.professor_id
                                ? ""
                                : prof.professor_id
                            );
                            handleSelectorChange(prof.professor_id);
                            setOpen(false);
                          }}
                        >
                          {prof.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === prof.professor_id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/*  */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                className="text-2xl p-5 w-full flex items-center my-auto"
              >
                {title}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Professor List</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={professor?.professor_id}
                onValueChange={handleSelectorChange}
              >
                {professorList.map((prof) => (
                  <DropdownMenuRadioItem
                    key={prof.professor_id}
                    value={prof.professor_id}
                  >
                    {prof.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu> */}

          <Label className="text-2xl min-w-[450px] flex items-center">{`Office Hours: ${
            formatHours() || ""
          }`}</Label>
        </div>
      </div>
      <div className="w-full px-5 mb-10">
        <Label className="text-2xl font-semibold">
          Professer's Available Schedule
        </Label>
        <div className="w-full flex items-center justify-center gap-10 ">
          <MyCalendar
            getDate={setDate}
            disabled={title === "Select Professor" ? true : false}
          />

          <TimePicker
            key={professor?.professor_id}
            defaultStartHour={getStartHour()[0]}
            defaultStartMinute={getStartHour()[1]}
            defaultStartPeriod={getStartHour()[2]}
            defaultEndHour={getEndHour()[0]}
            defaultEndMinute={getEndHour()[1]}
            defaultEndPeriod={getEndHour()[2]}
            minHour={officeHoursRange.minHour}
            maxHour={officeHoursRange.maxHour}
            onChange={(timeRange) =>
              setHours(`${timeRange.startTime}-${timeRange.endTime}`)
            }
            disabled={title === "Select Professor" ? true : false}
            scheduled={bookedSlots}
          />
        </div>
      </div>
    </div>
  );
};

const VerifyInformationPage = ({
  data,
  professorName,
}: VerifyInfoDialogProps) => {
  // useEffect(() => {
  //   console.log("Data to verify: ", data);
  // }, [data]);
  if (!data) {
    return <div>No appointment data available</div>;
  }

  function formatDate() {
    if (data) {
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);

      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      } as const;

      return {
        start: start.toLocaleString("en-US", options),
        end: end.toLocaleString("en-US", options),
      };
    }
    return { start: "", end: "" };
  }

  const formattedStartTime = formatDate();

  return (
    <div className="grid grid-cols-7 min-w-full min-h-full w-[1000px]">
      <div className="flex-col flex justify-center px-10 col-span-2 space-y-4">
        <Label className="text-2xl">Name: </Label>
        <Label className="text-2xl">Student number: </Label>
        <Label className="text-2xl">Student Email: </Label>
        <Label className="text-2xl">Appointment with </Label>
        <Label className="text-2xl">From: </Label>
        <Label className="text-2xl">To: </Label>
      </div>
      <div className="flex-col flex justify-center col-span-5 space-y-4">
        <Label className="text-2xl">{data.student_name}</Label>
        <Label className="text-2xl">{data.student_id}</Label>
        <Label className="text-2xl">{data.student_email}</Label>
        <Label className="text-2xl">{professorName}</Label>
        <Label className="text-2xl">{formattedStartTime.start}</Label>
        <Label className="text-2xl">{formattedStartTime.end}</Label>
      </div>
    </div>
  );
};

export const ReferenceNumberCard = ({
  referenceNumber,
}: {
  referenceNumber: string;
}) => {
  const [timer, setTimer] = useState(15); // 5 seconds countdown

  useEffect(() => {
    // This is a auto scroll timer, this will run according to the image duration set in the database
    const interval = setInterval(() => {
      if (timer <= 0) {
        clearInterval(interval);
        window.location.reload(); // Reload or navigate back
        return;
      }

      setTimer((prev) => prev - 1);
    }, 1000); // Use current image's duration

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <Card className="w-full max-w-lg mx-auto mt-4 h-full flex flex-col items-center">
      <CardHeader className="flex-row items-center justify-center">
        <CardTitle>Appointment Created</CardTitle>
      </CardHeader>
      <CardContent className="flex-col flex justify-center items-center">
        <Label className="text-2xl mb-8">Your reference number is:</Label>
        <Label className="text-5xl font-bold mb-8">{referenceNumber}</Label>
        <Label className="text-lg text-center">
          Use this reference number to track your appointment.
        </Label>
        <Button
          onClick={() => window.location.reload()} // Reload or navigate back
          className="mt-4"
        >
          {`Close (${timer})`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateAppointmentComponent;
