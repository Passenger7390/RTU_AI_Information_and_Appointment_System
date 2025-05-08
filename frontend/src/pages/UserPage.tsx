import { FaRegCalendarAlt } from "react-icons/fa";
import Chatbot from "@/my_components/Chatbot";
import MapPage from "./MapPage";
import AppointmentComponent from "@/my_components/AppointmentComponent";
import { FaRobot } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdOutlineHelpOutline } from "react-icons/md";
import Appointment1 from "/appointment1.png";
import Appointment2 from "/appointment2.png";
import ViewAppointment from "/view_appointment.png";

import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const UserPage = () => {
  const [view, setView] = useState("chatbot");

  return (
    <div className="flex-col">
      <div className="fixed flex-col items-center space-y-3 justify-between inset-y-0 w-32 p-3">
        {/* Using ToggleGroup instead of individual buttons */}
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => value && setView(value)}
          className="flex flex-col gap-3 rounded-lg size-full"
          defaultChecked
        >
          <ToggleGroupItem
            value="chatbot"
            className="size-26 rounded-md data-[state=on]:bg-yellow-500 data-[state=on]:text-white shadow-sm"
          >
            <FaRobot className="size-full p-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="appointment"
            className="size-26 rounded-md data-[state=on]:bg-yellow-500 data-[state=on]:text-white shadow-sm"
          >
            <FaRegCalendarAlt className="size-full p-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="map"
            className="size-26 rounded-md data-[state=on]:bg-yellow-500 data-[state=on]:text-white shadow-sm"
          >
            <FaMapMarkerAlt className="size-full p-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        {view === "chatbot" ? (
          <div className="pl-32">
            <Chatbot />
          </div>
        ) : view === "appointment" ? (
          <div className="pl-32 flex">
            <AppointmentComponent />
            <AppointmentHelpDialog />
          </div>
        ) : (
          <div className="pl-32">
            <MapPage />
          </div>
        )}
      </div>
    </div>
  );
};

function AppointmentHelpDialog() {
  const [page, setPage] = useState(0);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mx-auto size-18 p-4 mt-10 mr-10" variant={"ghost"}>
          <MdOutlineHelpOutline className="size-12" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[fit-content]">
        <div className="min-w-[fit-content] flex flex-col items-center justify-center">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-center text-2xl font-semibold">
              {page == 0
                ? "How to make an appointment"
                : "How to view an appointment"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-x-2 items-center justify-center min-w-[fit-content] mt-5">
            {page === 0 ? (
              <>
                <div className="w-[600px] h-[700px]">
                  <img
                    src={Appointment1}
                    alt="dasd"
                    className="w-full h-full"
                  />
                </div>
                <div className="w-[600px] h-[700px]">
                  <img
                    src={Appointment2}
                    alt="serwer"
                    className="w-full h-full"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-[600px] h-[700px]">
                  <img
                    src={ViewAppointment}
                    alt="dasd"
                    className="object-contain w-full h-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          {/* DIalog Footer */}
          <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
            <MdKeyboardArrowLeft />
          </Button>
          <Button disabled={page === 1} onClick={() => setPage(page + 1)}>
            <MdKeyboardArrowRight />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserPage;
