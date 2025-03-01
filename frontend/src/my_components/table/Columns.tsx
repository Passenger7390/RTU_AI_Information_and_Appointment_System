import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TableData = {
  id: number;
  created_at: string;
  filename: string;
  title: string;
  duration: number;
  expiration: string;
};

export const columns: ColumnDef<TableData>[] = [
  {
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
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => <div className="text-white flex justify-center">ID</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("id")}</div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => (
      <div className="text-white flex justify-center">Created At</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("created_at")}
        </div>
      );
    },
  },
  {
    accessorKey: "filename",
    header: () => (
      <div className="text-white flex justify-center">Filename</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("filename")}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: () => <div className="text-white flex justify-center">Title</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("title")}</div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: () => (
      <div className="text-white flex justify-center">Duration</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("duration")}
        </div>
      );
    },
  },
  {
    accessorKey: "expires_in",
    header: () => (
      <div className="text-white flex justify-center">Expiration</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("expires_in")}
        </div>
      );
    },
  },
];
