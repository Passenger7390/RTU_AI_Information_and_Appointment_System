import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CreateAppointmentComponent from "./CreateAppointment";

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
