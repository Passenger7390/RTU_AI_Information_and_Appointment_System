import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

// Generic function to create selection column
export function createSelectionColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

// Generic function to create standard data column
export function createDataColumn<T>(
  accessorKey: keyof T & string,
  header: string,
  headerClassName: string = "",
  cellClassName: string = "text-center font-medium"
): ColumnDef<T> {
  return {
    accessorKey,
    header: () => <div className={headerClassName}>{header}</div>,
    cell: ({ row }) => {
      return <div className={cellClassName}>{row.getValue(accessorKey)}</div>;
    },
  };
}

export function createButtonColumn<T>(
  id: string,
  headerText: string,
  buttonText: string,
  buttonVariant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link" = "default",
  onClick: (row: T) => void,
  headerClassName: string = "text-white flex justify-center",
  conditionalRender?: (row: T) => boolean
): ColumnDef<T> {
  return {
    id,
    header: () => <div className={headerClassName}>{headerText}</div>,
    cell: ({ row }) => {
      // Don't render the button if the conditional function returns false
      if (conditionalRender && !conditionalRender(row.original)) {
        return null;
      }

      return (
        <div className="flex justify-center">
          <Button
            variant={buttonVariant}
            onClick={() => onClick(row.original)}
            size="sm"
          >
            {buttonText}
          </Button>
        </div>
      );
    },
    enableSorting: false,
  };
}

// Example usage - create advertisement columns
export function createAdColumns(
  headerClassName: string = "text-white flex justify-center"
): ColumnDef<TableData>[] {
  return [
    createSelectionColumn<TableData>(),
    createDataColumn<TableData>("id", "ID", headerClassName),
    createDataColumn<TableData>("created_at", "Created At", headerClassName),
    createDataColumn<TableData>("filename", "Filename", headerClassName),
    createDataColumn<TableData>("title", "Title", headerClassName),
    createDataColumn<TableData>("duration", "Duration", headerClassName),
    createDataColumn<TableData>("expires_in", "Expiration", headerClassName),
  ];
}

// Export type for reference
export type TableData = {
  id: number;
  created_at: string;
  filename: string;
  title: string;
  duration: number;
  expires_in: string;
};

// Create similar functions for other table types
export function createProfessorColumns(
  headerClassName: string = "text-white flex justify-center"
): ColumnDef<ProfessorData>[] {
  return [
    createSelectionColumn<ProfessorData>(),
    // createDataColumn<ProfessorData>("professor_id", "ID", headerClassName),
    createDataColumn<ProfessorData>("name", "Name", headerClassName),
    createDataColumn<ProfessorData>("email", "Email", headerClassName),
    createDataColumn<ProfessorData>(
      "office_hours",
      "Office Hours",
      headerClassName
    ),
  ];
}

export type ProfessorData = {
  professor_id: string;
  name: string;
  email: string;
  office_hours: string;
};

export function createAppointmentColumns(
  headerClassName: string = "text-white flex justify-center",
  onAccept?: (appointment: AppointmentData) => void,
  onReject?: (appointment: AppointmentData) => void
): ColumnDef<AppointmentData>[] {
  return [
    createSelectionColumn<AppointmentData>(),
    // createDataColumn<AppointmentData>(
    //   "uuid",
    //   "Appointment ID",
    //   headerClassName
    // ),
    createDataColumn<AppointmentData>(
      "student_name",
      "Student Name",
      headerClassName
    ),
    createDataColumn<AppointmentData>(
      "professor_name",
      "Professor Name",
      headerClassName
    ),
    createDataColumn<AppointmentData>(
      "start_time",
      "Start Time",
      headerClassName
    ),
    createDataColumn<AppointmentData>("end_time", "End Time", headerClassName),
    createDataColumn<AppointmentData>("status", "Status", headerClassName),
    // Add button columns
    createButtonColumn<AppointmentData>(
      "accept",
      "",
      "Accept",
      "default",
      (row) => onAccept?.(row),
      headerClassName,
      (row) => row.status === "Pending" // Only show for pending appointments
    ),
    createButtonColumn<AppointmentData>(
      "reject",
      "Actions", // Empty header for the second action button
      "Reject",
      "destructive",
      (row) => onReject?.(row),
      headerClassName,
      (row) => row.status === "Pending" // Only show for pending appointments
    ),
  ];
}

export type AppointmentData = {
  uuid: string;
  student_name: string;
  professor_name: string;
  start_time: string;
  end_time: string;
  status: string;
  professor_id: string;
};
