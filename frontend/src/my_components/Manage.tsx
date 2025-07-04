import UploadCard from "@/my_components/UploadCard";
import DeleteDialog from "@/my_components/DeleteDialog";
import { DataTable } from "@/my_components/table/DataTable";
import {
  getTableData,
  deleteRows,
  getFAQs,
  getProfessors,
  deleteProfessors,
  getAppointments,
  actionAppointment,
  getUser,
} from "@/api";
import {
  createAdColumns,
  TableData,
  ProfessorData,
  createProfessorColumns,
  AppointmentData,
  createAppointmentColumns,
} from "@/my_components/table/Columns";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FAQCard, FAQDialog, UserFAQ } from "@/my_components/FAQ";
import CreateProfessorDialog from "./CreateProfessorDialog";
import { FAQ } from "@/interface";
import EditProfileDialog from "./EditProfileDialog";
import { useNavigate } from "react-router-dom";
import RescheduleDialog from "./RescheduleDIalog";

export const AdComponent = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = createAdColumns();
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
      toast.error("Failed to delete rows");
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
        emptyMessage="No advertisements available. Upload a new one."
        enableSelection={true}
      />
    </div>
  );
};

export const FAQComponent = () => {
  const [faqs, setFAQs] = useState<FAQ[]>([]);

  const fetchFAQs = async () => {
    try {
      const faqs = await getFAQs();
      setFAQs(faqs);
    } catch (error) {
      toast.error("Failed to fetch FAQs");
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return (
    <div className="flex-row h-full w-full p-2 space-y-8">
      <div className="flex justify-start items-center space-x-2">
        <FAQDialog onRefresh={fetchFAQs} />

        <UserFAQ />
      </div>
      {faqs.length == 0 ? (
        <div className="flex flex-col justify-center items-center h-[72vh] w-full rounded-xl space-y-2">
          <p>There is no FAQ. Add a new one.</p>
          <FAQDialog onRefresh={fetchFAQs} />
        </div>
      ) : (
        <div className="w-full h-full grid grid-cols-3 gap-4">
          {faqs.map((faq, index) => (
            <FAQCard
              key={index}
              idProp={faq.id}
              questionProp={faq.question}
              synonymsProp={faq.synonyms}
              answerProp={faq.answer}
              isPinnedProp={faq.isPinned}
              onRefresh={fetchFAQs}
            />
          ))}
        </div>
      )}
      {}
    </div>
  );
};

export const ProfessorComponent = () => {
  const [professorData, setProfessorData] = useState<ProfessorData[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = createProfessorColumns();

  useEffect(() => {
    fetchTableData();
  }, []);

  async function fetchTableData() {
    try {
      const data = await getProfessors();
      setProfessorData(data);
    } catch (error) {
      toast.error("Failed to fetch table data");
    }
  }

  async function handleDeleteSelected() {
    try {
      const selectedRows = Object.keys(rowSelection);
      if (selectedRows.length === 0) return;

      const selectedIds = selectedRows.map(
        (index) => professorData[parseInt(index)].professor_id
      );
      await deleteProfessors(selectedIds);
      setRowSelection({});
      await fetchTableData(); // Refresh the table after deletion
    } catch (error) {
      toast.error("Failed to delete rows");
    }
  }

  function handleEditSelected() {
    const selectedRows = Object.keys(rowSelection);
    if (selectedRows.length === 0) return;

    const selectedIds = selectedRows.map(
      (index) => professorData[parseInt(index)].professor_id
    );

    return selectedIds[0];
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={professorData}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
        emptyMessage="No professors found. Add a new professor."
        enablePagination={false}
        actions={
          <>
            <CreateProfessorDialog onRefresh={fetchTableData} />
            <EditProfileDialog
              professor_uuid={handleEditSelected() || ""}
              disabled={
                Object.keys(rowSelection).length === 0 ||
                Object.keys(rowSelection).length > 1
              }
              onRefresh={fetchTableData}
            />
            <DeleteDialog
              onConfirm={handleDeleteSelected}
              isButtonDisabled={Object.keys(rowSelection).length === 0}
            />
          </>
        }
      />
    </div>
  );
};

export const AppointmentComponent = () => {
  const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);
  const navigate = useNavigate();
  const columns = createAppointmentColumns(
    "text-white flex justify-center",
    handleAcceptAppointment,
    handleRejectAppointment
  );
  const [rowSelection, setRowSelection] = useState({});

  const [role, setRole] = useState("");
  const [profID, setProfID] = useState("");
  const [uuid, setUUID] = useState("");

  async function fetchUser() {
    try {
      const response = await getUser();
      setRole(response.data.role);
      setProfID(response.data.professor_id);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  async function fetchAppointmentTableData() {
    try {
      if (role === "superuser" || role === "professor") {
        const tableData = await getAppointments();
        if (tableData) {
          if (role === "professor") {
            // Filter appointments for professor
            const filteredData = tableData.filter(
              (appointment: any) => appointment.professor_id === profID
            );
            setAppointmentData(filteredData);
          } else {
            // For superuser, show all appointments
            setAppointmentData(tableData);
          }
        }
      }
    } catch (error) {
      toast.error("Failed to fetch appointment data");
      console.error("Error fetching appointment data:", error);
    }
  }

  async function handleAcceptAppointment(appointment: AppointmentData) {
    try {
      // Implement API call to accept appointment
      await actionAppointment(appointment.uuid, "accept"); // You'll need to create this API function
      toast.success("Appointment accepted");
      fetchAppointmentTableData();
    } catch (error) {
      toast.error("Failed to accept appointment");
    }
  }

  async function handleRejectAppointment(appointment: AppointmentData) {
    try {
      // Implement API call to reject appointment
      await actionAppointment(appointment.uuid, "reject"); // You'll need to create this API function
      toast.success("Appointment rejected");
      fetchAppointmentTableData();
    } catch (error) {
      toast.error("Failed to reject appointment");
    }
  }

  function handleSelected() {
    const selectedRows = Object.keys(rowSelection);
    if (selectedRows.length === 0) return;

    const selectedIds = selectedRows.map(
      (index) => appointmentData[parseInt(index)].uuid
    );

    setUUID(selectedIds[0]);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchAppointmentTableData();
  }, [role]);

  useEffect(() => {
    handleSelected();
  }, [rowSelection]);

  return (
    <div>
      <DataTable
        columns={columns}
        data={appointmentData}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
        emptyMessage="No appointments found."
        enablePagination={false}
        actions={
          <>
            <RescheduleDialog
              disabled={
                Object.keys(rowSelection).length === 0 ||
                Object.keys(rowSelection).length > 1
              }
              uuid={uuid}
              onRefresh={fetchAppointmentTableData}
            />
          </>
        }
      />
    </div>
  );
};
