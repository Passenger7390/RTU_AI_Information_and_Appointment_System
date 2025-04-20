import { getUser } from "@/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AdComponent,
  AppointmentComponent,
  FAQComponent,
  ProfessorComponent,
} from "@/my_components/Manage";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [currentView, setCurrentView] = useState("manage-advertisement");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await getUser();
      setRole(response.data.role);
      console.log(role);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  function handleLogOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="flex-col h-full p-8 space-y-8 w-full justify-center">
      <div className="flex items-center justify-between h-20">
        <div className="flex-1 flex items-center justify-center h-full space-x-4">
          <ToggleGroup
            type="single"
            className="flex w-full h-full"
            defaultValue="manage-advertisement"
            onValueChange={(value) => {
              if (value) setCurrentView(value);
            }}
          >
            <ToggleGroupItem value="manage-advertisement" defaultChecked>
              <p className="font-bold text-xl">Manage Advertisement</p>
            </ToggleGroupItem>
            <ToggleGroupItem value="manage-faq">
              <p className="font-bold text-xl">Manage FAQs</p>
            </ToggleGroupItem>
            {role === "superuser" && (
              <ToggleGroupItem value="manage-professor">
                <p className="font-bold text-xl">Manage Professors</p>
              </ToggleGroupItem>
            )}
            <ToggleGroupItem value="manage-appointments">
              <p className="font-bold text-xl">Manage Appointments</p>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Button className="p-5 mx-5" onClick={handleLogOut}>
          Logout
        </Button>
      </div>
      {(() => {
        switch (currentView) {
          case "manage-advertisement":
            return <AdComponent />;
          case "manage-faq":
            return <FAQComponent />;
          case "manage-professor":
            return <ProfessorComponent />; // Placeholder for Professor management
          case "manage-appointments":
            return <AppointmentComponent />; // Placeholder for Appointment management
          default:
            return <AdComponent />; // Fallback view
        }
      })()}
    </div>
  );
};

export default Dashboard;
