import { getUser } from "@/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataTable } from "@/my_components/table/DataTable";
import { getTableData, deleteRows } from "@/api";
import { columns } from "@/my_components/table/Columns";

import UploadCard from "@/my_components/UploadCard";
import DeleteDialog from "@/my_components/DeleteDialog";
import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TableData {
  id: number;
  created_at: string;
  filename: string;
  title: string;
  duration: number;
  expiration: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [currentView, setCurrentView] = useState("manage-advertisement");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      fetchUser();
      fetchTableData();
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

  const fetchTableData = async () => {
    try {
      const data = await getTableData();
      setTableData(data);
    } catch (error) {
      console.error("Failed to fetch table data:", error);
    }
  };

  const handleUploadComplete = async () => {
    await fetchTableData();
    toast.success("File uploaded successfully!");
  };

  const handleDeleteSelected = async () => {
    try {
      const selectedRows = Object.keys(rowSelection);
      if (selectedRows.length === 0) return;

      const selectedIds = selectedRows.map(
        (index) => tableData[parseInt(index)].id
      );
      await deleteRows(selectedIds);
      setRowSelection({});
      await fetchTableData(); // Refresh the table after deletion
    } catch (error) {
      console.error("Failed to delete rows:", error);
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
            onValueChange={(value) => setCurrentView(value)}
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

      <div className="p-8 space-y-8 w-full h-full">
        <div className="flex-row w-full max-h-full justify-center">
          <div className="flex justify-between">
            <p className="text-3xl font-extrabold">Manage Advertisements</p>
            <div></div>
            <div className="flex space-x-1">
              <UploadCard onUploadComplete={handleUploadComplete} />
              <DeleteDialog
                onConfirm={handleDeleteSelected}
                isButtonDisabled={Object.keys(rowSelection).length === 0}
              />
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={tableData}
          onRowSelectionChange={setRowSelection}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
};

export default Dashboard;
