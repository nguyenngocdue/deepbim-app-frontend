import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Enrollment } from "./types";
import { LinkId } from "@/components/common/LinkId";
import { AvatarUser } from "@/components/AvatarUser";
import CustomBadge from "@/components/common/CustomBadge";
import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { BuildColumns } from "@/features/tutorials/functions/BuildColumns";
import { GenericTable } from "@/features/tutorials/functions/GenericTable";

interface EnrollmentTableProps {
  data: Enrollment[] | null;
  filter: string;
  onEdit: (row: Enrollment) => void;
  onDelete: (row: Enrollment) => void;
  onView: (row: Enrollment) => void;
}

export const EnrollmentTable = ({
  data,
  filter,
  onEdit,
  onDelete,
  onView,
}: EnrollmentTableProps) => {

  const baseColumns: ColumnDef<Enrollment>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <LinkId
          id={`${row.original.id}`}
          href="/managements/enrollments"
          tail="/dashboard"
        />
      ),
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ getValue }) => {
        const val = getValue() as Enrollment["user"];
        return (
          <AvatarUser
            name={val?.user_name || ""}
            img={val?.picture}
            id={val?.id}
            email={val?.email}
          />
        );
      },
    },
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ getValue }) => {
        const val = getValue() as Enrollment["course"];
        return <span title={`Course Id: #${val.id}`}>{val?.title}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue() as Enrollment["status"];
        return (
          <CustomBadge
            text={val?.name}
            className={val?.class_name}
          />
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <DateTimeDisplay isoDate={row.original.created_at} />
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }) => (
        <DateTimeDisplay isoDate={row.original.updated_at} />
      ),
    },
       {
      accessorKey: "full_name",
      header: "Full Name",
    },
      {
      accessorKey: "email",
      header: "Email",
    },
      {
      accessorKey: "phone",
      header: "Phone",
    },
     {
      accessorKey: "zalo_link",
      header: "Zalo Link",
    },

  ];

  const columns = useMemo(
    () =>
      BuildColumns<Enrollment>({
        baseColumns,
        onEdit,
        onDelete,
        onView,
      }),
    [onEdit, onDelete, onView]
  );

  return (
    <GenericTable<Enrollment>
      data={data}
      filter={filter}
      columns={columns}
      filterBy={(row, keyword) =>
        row?.user?.user_name?.toLowerCase().includes(keyword.toLowerCase()) ||
        row?.course?.title?.toLowerCase().includes(keyword.toLowerCase())
      }
      loadingMessage="Loading enrollments..."
    />
  );
};
