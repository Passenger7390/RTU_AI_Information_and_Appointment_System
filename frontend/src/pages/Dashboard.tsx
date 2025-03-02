import { getUser } from "@/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataTable } from "@/my_components/table/DataTable";
import { getTableData, deleteRows } from "@/api";
import { columns } from "@/my_components/table/Columns";
import { Button } from "@/components/ui/button";
import UploadCard from "@/my_components/UploadCard";
import toast from "react-hot-toast";

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
    <div className="flex-col h-full p-8 space-y-8 w-full">
      <h1 className="text-5xl font-extrabold">Hello {user}!</h1>
      <div className="w-[1200px] max-h-[3000px] space-y-5">
        <div className="flex justify-between">
          <p className="text-3xl font-extrabold">Manage Advertisements</p>
          <div></div>
          <div className="flex space-x-1">
            <UploadCard onUploadComplete={handleUploadComplete} />
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={Object.keys(rowSelection).length === 0}
            >
              Delete
            </Button>
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
