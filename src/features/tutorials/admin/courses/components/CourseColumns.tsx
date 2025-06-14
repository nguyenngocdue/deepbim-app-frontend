import { ColumnDef } from "@tanstack/react-table";
import { LinkId } from "@/components/common/LinkId";
import { AvatarUser } from "@/components/AvatarUser";
import CustomBadge from "@/components/common/CustomBadge";
import { PriceDisplay } from "@/components/bim-viewer/common/PriceDisplay";
import { BooleanDisplay } from "@/components/bim-viewer/common/BooleanDisplay";
import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { TableRowActions } from "@/components/bim-viewer/common/TableRowActions";
import { Course } from "./types";

interface CourseColumnsProps {
  onEdit: (row: Course) => void;
  onDelete: (row: Course) => void;
  onView: (row: Course) => void;
}

export const CourseColumns = ({ onEdit, onDelete, onView }: CourseColumnsProps): ColumnDef<Course>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <LinkId id={`${row.original.id}`} href="/managements/courses" tail="/dashboard" />
    ),
  },
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "old_price",
    header: "Old Price",
    cell: ({ row }) => <PriceDisplay price={row.original.old_price} />,
  },
  {
    accessorKey: "new_price",
    header: "New Price",
    cell: ({ row }) => <PriceDisplay price={row.original.new_price} />,
  },
  {
    accessorKey: "is_free",
    header: "Is Free",
    cell: ({ row }) => <BooleanDisplay value={row.original.is_free} />,
  },
  { accessorKey: "students_count", header: "Students Count" },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => <DateTimeDisplay isoDate={row.original.updated_at} />,
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ getValue }) => {
      const val = getValue() as Course["owner"];
      return <AvatarUser name={val?.user_name || ""} img={val?.picture} id={val?.id} email={val?.email} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const val = getValue() as Course["status"];
      return <CustomBadge text={val?.name || ""} className={val?.class_name || ""} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <TableRowActions
        row={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    ),
  },
];