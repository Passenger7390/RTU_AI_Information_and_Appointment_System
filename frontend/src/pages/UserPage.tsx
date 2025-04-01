import { FaRegCalendarAlt } from "react-icons/fa";
import Chatbot from "@/my_components/Chatbot";
import MapPage from "./MapPage";
import AppointmentComponent from "@/my_components/AppointmentComponent";
import { FaRobot } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const UserPage = () => {
  const [view, setView] = useState("appointment");

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
            className="size-26 rounded-md data-[state=on]:bg-slate-900 data-[state=on]:text-white shadow-sm"
          >
            <FaRobot className="size-full p-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="appointment"
            className="size-26 rounded-md data-[state=on]:bg-slate-900 data-[state=on]:text-white shadow-sm"
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
          <Chatbot />
        ) : view === "appointment" ? (
          <div className="pl-32">
            <AppointmentComponent />
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

export default UserPage;
