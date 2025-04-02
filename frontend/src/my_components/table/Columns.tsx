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
    createDataColumn<ProfessorData>("professor_id", "ID", headerClassName),
    createDataColumn<ProfessorData>(
      "first_name",
      "First Name",
      headerClassName
    ),
    createDataColumn<ProfessorData>(
      "first_name",
      "First Name",
      headerClassName
    ),
    createDataColumn<ProfessorData>("last_name", "Last Name", headerClassName),
    createDataColumn<ProfessorData>("last_name", "Last Name", headerClassName),
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
  first_name: string;
  last_name: string;
  email: string;
  office_hours: string;
};
