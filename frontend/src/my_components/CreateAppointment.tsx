import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import OTPDialog from "./OTPDialog";
import toast from "react-hot-toast";
import { KeyboardInput } from "./KeyboardInput";
import { KeyboardTextArea } from "./KeyboardTextArea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getProfessors } from "@/api";
import { MyCalendar } from "./myCalendar";
import { TimePicker } from "./timePicker";
import { IoMdClose } from "react-icons/io";
import {
  Appointment,
  PersonalInfoPageProps,
  ProfessorInfoPageProps,
  ProfessorList,
} from "@/interface";

const CreateAppointmentComponent = ({ onBack }: { onBack: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0);
  // const [appointmentData, setAppointmentData] = useState<Appointment>({
  //   studentName: "",
  //   studentID: "",
  //   studentEmail: "",
  //   professor_uuid: "",
  //   concern: "",
  //   appointmentStart: new Date(),
  //   appointmentEnd: new Date(),
  //   isEmailVerified: false,
  // });

  const totalPages = 3;

  const [studentInfoPage, setStudentInfoPage] = useState({
    studentName: "",
    studentID: "",
    studentEmail: "",
    concern: "",
    isEmailVerified: false,
  });

  const [professorInfoPage, setProfessorInfoPage] = useState({
    professor_uuid: "",
    appointmentStart: "",
    appointmentEnd: "",
    isDateValid: false,
    isTimeValid: false,
  });

  const [verifyInfoPage, setVerifyInfoPage] = useState<Appointment>();

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <PersonalInfoPage
            setStudentInformation={setStudentInfoPage}
            initialData={{
              studentName: studentInfoPage.studentName,
              studentID: studentInfoPage.studentID,
              studentEmail: studentInfoPage.studentEmail,
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
              appointmentStart: professorInfoPage.appointmentStart,
              appointmentEnd: professorInfoPage.appointmentEnd,
              isDateValid: professorInfoPage.isDateValid,
              isTimeValid: professorInfoPage.isTimeValid,
            }}
          />
        );
      case 2:
        return <VerifyInformationPage data={verifyInfoPage} />;
      default:
        return (
          <PersonalInfoPage
            setStudentInformation={setStudentInfoPage}
            initialData={{
              studentName: studentInfoPage.studentName,
              studentID: studentInfoPage.studentID,
              studentEmail: studentInfoPage.studentEmail,
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
        !studentInfoPage.studentName ||
        !studentInfoPage.studentID ||
        !studentInfoPage.concern ||
        !studentInfoPage.studentEmail
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
          studentName: studentInfoPage.studentName,
          studentID: studentInfoPage.studentID,
          studentEmail: studentInfoPage.studentEmail,
          professor_uuid: professorInfoPage.professor_uuid,
          concern: studentInfoPage.concern,
          appointmentStart: professorInfoPage.appointmentStart,
          appointmentEnd: professorInfoPage.appointmentEnd,
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

  const submitForm = () => {
    if (currentPage === totalPages - 1) {
      // Submit the form data
      toast.success("Appointment created successfully!");
      onBack();
      // TODO: Send the data to the backend
      // TODO: format the data to save in database
    }
  };

  return (
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
      <CardContent className="flex flex-col gap-5">{renderPage()}</CardContent>
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
  );
};

const PersonalInfoPage = ({
  setStudentInformation,
  initialData,
}: PersonalInfoPageProps) => {
  const [studentID, setStudentID] = useState(initialData.studentID);
  const [studentName, setStudentName] = useState(initialData.studentName);
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
      studentName,
      studentID,
      studentEmail: `${studentID}@rtu.edu.ph`,
      concern,
      isEmailVerified: emailVerified,
    });
  }, [studentName, studentID, concern, emailVerified, setStudentInformation]);

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full w-[1000px]">
      <div className="p-10 space-y-5 grid gap-4 items-center w-[1000px]">
        <div className="grid gap-5 grid-cols-6">
          <Label className="text-3xl text-right">Name</Label>
          {/* <Input className="!text-xl col-span-5" required type="text" /> */}
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

  // TODO: disabled the hours if professor has appointment already

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
      professor_uuid: professor?.professor_id || "test",
      appointmentStart: `${date} ${hours.split("-")[0]}`,
      appointmentEnd: `${date} ${hours.split("-")[1]}`,
      isDateValid: date !== "",
      isTimeValid: hours !== "",
    });

    console.log("hours: ", hours);
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

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full w-[1000px]">
      <div className="w-full px-5 mb-10">
        <Label className="text-2xl font-semibold">Professor Schedule</Label>
        <div className="w-full flex gap-4 item-center justify-center h-20">
          <DropdownMenu>
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
          </DropdownMenu>

          <Label className="text-2xl min-w-[450px] flex items-center">{`Office Hours: ${
            formatHours() || ""
          }`}</Label>
        </div>
      </div>
      <div className="w-full px-5 mb-10">
        <Label className="text-2xl font-semibold">
          Professer's Available Schedule
        </Label>
        <div className="w-full flex items-center justify-end gap-4 ">
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
          />
        </div>
      </div>
    </div>
  );
};

const VerifyInformationPage = ({ data }: { data: Appointment | undefined }) => {
  useEffect(() => {
    console.log("Data to verify: ", data);
  }, [data]);
  if (!data) {
    return <div>No appointment data available</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full w-[1000px]">
      <Label>{`${data.studentName}`}</Label>
      <Label>{data.studentID}</Label>
      <Label>{data.studentEmail}</Label>
      <Label>{data.concern}</Label>
      <Label>{data.professor_uuid}</Label>
      <Label>{data.appointmentStart}</Label>
      <Label>{data.appointmentEnd}</Label>
      <Button>{data.studentName}</Button>
    </div>
  );
};

export default CreateAppointmentComponent;
