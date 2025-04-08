import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CreateAppointmentComponent from "./CreateAppointment";
import { Label } from "@/components/ui/label";
import { getAppointmentById } from "@/api";
import { KeyboardInput } from "./KeyboardInput";
import { Skeleton } from "@/components/ui/skeleton";
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

// TODO: Implement the view appointment component, use the same structure in verifyInfoPage,
// Get the data with getAppointmentsById and display it in the card
export const ViewAppointmentComponent = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const [data, setData] = useState({
    student_name: "",
    student_id: "",
    student_email: "",
    professor_name: "",
    start_time: "",
    end_time: "",
    status: "",
  });

  const [reference, setReferenceNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [found, setFound] = useState(false);
  async function getAppointmentData() {
    setSearched(true);
    try {
      setIsLoading(true);
      const res = await getAppointmentById(reference);
      if (res && res.student_name) {
        setData({
          student_name: res.student_name,
          student_id: res.student_id,
          student_email: res.student_email,
          professor_name: res.professor_name,
          start_time: res.start_time,
          end_time: res.end_time,
          status: res.status,
        });
        setFound(true);
      } else {
        setFound(false);
      }
    } catch (error: any) {
      console.error("Error fetching appointment data:", error);
      toast.error(
        "Error fetching appointment data. Please check the reference number."
      );
      setFound(false);
    } finally {
      setIsLoading(false);
    }
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
    <Card className="w-[80vh] min-h-[fit-content] p-5">
      <CardHeader className="flex-row items-center w-full pb-20">
        <CardTitle className="flex text-5xl mx-auto justify-center flex-1">
          View Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-20">
        {searched ? (
          <div className="flex min-w-full min-h-full w-full">
            {isLoading ? (
              <Skeleton className="min-h-full min-w-full" />
            ) : found ? (
              <>
                <div className="flex-col flex justify-center px-10 space-y-4">
                  <Label className="text-2xl">Name: </Label>
                  <Label className="text-2xl">Student number: </Label>
                  <Label className="text-2xl">Student Email: </Label>
                  <Label className="text-2xl">Appointment with </Label>
                  <Label className="text-2xl">From: </Label>
                  <Label className="text-2xl">To: </Label>
                  <Label className="text-2xl">Status: </Label>
                </div>
                <div className="flex-col flex justify-center space-y-4">
                  <Label className="text-2xl">{data.student_name}</Label>
                  <Label className="text-2xl">{data.student_id}</Label>
                  <Label className="text-2xl">{data.student_email}</Label>
                  <Label className="text-2xl">{data.professor_name}</Label>
                  <Label className="text-2xl">{formattedStartTime.start}</Label>
                  <Label className="text-2xl">{formattedStartTime.end}</Label>
                  <Label className="text-2xl">{data.status}</Label>
                </div>
              </>
            ) : (
              <div className="flex-col flex items-center justify-center mx-auto">
                <Label className="text-2xl">No appointment found</Label>
                <IoMdClose className="w-20 h-20 text-red-500" />
              </div>
            )}
          </div>
        ) : (
          <>
            <Label className="text-2xl">Reference Number</Label>
            <KeyboardInput
              type="text"
              value={reference}
              onChange={(e) => setReferenceNumber(e.target.value)}
              keyboardType="alphanumeric"
              className="!text-xl col-span-5"
              required
            />
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center space-x-10">
        <Button
          size={"lg"}
          onClick={getAppointmentData}
          disabled={searched || !reference.trim()}
        >
          Search
        </Button>
        <Button size={"lg"} onClick={onBack}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentComponent;
