import { ColumnDef } from "@tanstack/react-table";
import { LinkId } from "@/components/common/LinkId";
import { AvatarUser } from "@/components/AvatarUser";
import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { TableRowActions } from "@/components/bim-viewer/common/TableRowActions";
import { Lesson } from "./types";

interface LessonColumnsProps {
  onEdit: (row: Lesson) => void;
  onDelete: (row: Lesson) => void;
  onView: (row: Lesson) => void;
}

export const LessonColumns = ({ onEdit, onDelete, onView }: LessonColumnsProps): ColumnDef<Lesson>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <LinkId id={`${row.original.id}`} href="/managements/courses" tail="/dashboard" />
    ),
  },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "description", header: "Description" },  
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => <DateTimeDisplay isoDate={row.original.updated_at} />,
  },

  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ getValue }) => {
      const val = getValue() as Lesson["owner"];
      return <AvatarUser name={val?.user_name || ""} img={val?.picture} id={val?.id} email={val?.email} />;
    },
  },
  { accessorKey: "video_url", header: "Video Url" },
  { accessorKey: "duration", header: "duration" },
  { accessorKey: "content", header: "content" },
  { accessorKey: "is_locked", header: "Is Locked" },
   {
     accessorKey: "course",
     header: "Course",
     cell: ({ row }) => <span>{row.original.course.title}</span>,
   },
 {
     accessorKey: "section",
     header: "Section",
     cell: ({ row }) => <span>{row.original.section.title}</span>,
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