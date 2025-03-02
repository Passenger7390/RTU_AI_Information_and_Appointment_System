import UploadCard from "@/my_components/UploadCard";
import DeleteDialog from "@/my_components/DeleteDialog";
import { DataTable } from "@/my_components/table/DataTable";
import { getTableData, deleteRows } from "@/api";
import { columns } from "@/my_components/table/Columns";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

interface TableData {
  id: number;
  created_at: string;
  filename: string;
  title: string;
  duration: number;
  expiration: string;
}

export const AdComponent = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    fetchTableData();
  }, []);

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
  );
};

export const FAQComponent = () => {
  return <div></div>;
};
