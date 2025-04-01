import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import OTPDialog from "./OTPDialog";
import { UUID } from "crypto";
import toast from "react-hot-toast";

const AppointmentComponent = () => {
  const [activeView, setActiveView] = useState("none");
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-5 p-5">
      {activeView === "none" ? (
        <>
          <Button
            size={"lg"}
            className="text-2xl h-20 w-96 flex items-center justify-center"
            onClick={() => setActiveView("create")}
          >
            Create Appointment
          </Button>
          <Button
            size={"lg"}
            className="text-2xl h-20 w-96 flex items-center justify-center"
            onClick={() => setActiveView("view")}
          >
            View Appointment
          </Button>
        </>
      ) : activeView === "create" ? (
        <>
          {/* This is for the create appointment view */}
          <CreateAppointmentComponent onBack={() => setActiveView("none")} />
        </>
      ) : (
        <>
          {/* This is for the view appointment view */}
          <ViewAppointmentComponent onBack={() => setActiveView("none")} />
        </>
      )}
    </div>
  );
};

export const CreateAppointmentComponent = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  interface Appointment {
    studentName: string;
    studentID: string;
    studentEmail: string;
    professor_uuid: UUID;
    concern: string;
    appointmentDate: Date;
    appointmentTime: Date;
  }

  interface StudentInformation {
    studentName: string;
    studentID: string;
    studentEmail: string;
    concern: string;
  }

  const [currentPage, setCurrentPage] = useState(0);
  const [studentInformation, setStudentInformation] =
    useState<StudentInformation>();
  const totalPages = 3;

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <PersonalInfoPage />;
      case 1:
        return <ProfessorInfoPage />;
      case 2:
        return <VerifyInformationPage />;
      default:
        return <PersonalInfoPage />;
    }
  };

  const nextPage = () => {
    if (currentPage === 0) {
      if (!studentInformation) {
        toast.error("Please fill out the form before proceeding.");
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

const PersonalInfoPage = () => {
  const [studentID, setStudentID] = useState("");

  // Handle the pagination

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full w-[1000px]">
      <div className="p-10 space-y-5 grid gap-4 items-center w-[1000px]">
        <div className="grid gap-5 grid-cols-6">
          <Label className="text-3xl text-right">Name</Label>
          <Input className="!text-xl col-span-5" required type="text" />
        </div>
        <div className="grid gap-5 grid-cols-6">
          <Label className="text-3xl text-right">Email</Label>
          <div className="flex col-span-4">
            <Input
              className="!text-xl"
              placeholder="2021-123456"
              type="email"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              required
              size={12}
            />
            <Label className="text-xl">@rtu.edu.ph</Label>
          </div>
          <OTPDialog email={`${studentID}`} />
        </div>
        <div className="grid gap-5 grid-cols-6">
          <Label className="text-3xl text-right flex-1">Concern</Label>
          <Textarea
            placeholder="Type your concern here."
            maxLength={500}
            className="max-w-[64rem] !text-xl col-span-5 max-h-36 overflow-x-hidden resize-none"
            required
          />
        </div>
      </div>
    </div>
  );
};

const ProfessorInfoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full w-[1000px]">
      test
    </div>
  );
};

const VerifyInformationPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full w-[1000px]">
      test
    </div>
  );
};

export const ViewAppointmentComponent = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  return (
    <Card className="w-full h-full">
      <CardHeader className="flex-row items-center w-full">
        <div className="flex-1 items-center">
          <CardTitle className="flex text-5xl mx-auto justify-center flex-1">
            View Appointment
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
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default AppointmentComponent;
