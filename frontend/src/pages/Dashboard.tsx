import { getUser } from "@/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AdComponent, FAQComponent } from "@/my_components/Manage";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

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
      setUser(response.data.username);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="flex-col h-full p-8 space-y-8 w-full justify-center">
      <div className="flex items-center justify-between h-20">
        <div className="flex w-[500px]">
          <h1 className="text-5xl font-extrabold">Hello {user}!</h1>
        </div>
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
          </ToggleGroup>
        </div>
        <div className="flex w-[500px]"></div>
      </div>
      {currentView == "manage-advertisement" ? (
        <AdComponent />
      ) : (
        <FAQComponent />
      )}
    </div>
  );
};

export default Dashboard;
