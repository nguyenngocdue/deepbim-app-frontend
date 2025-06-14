import { Course } from "./types";

interface FormOption {
  label: string;
  value: string | boolean;
}

interface CourseFormConfigProps {
  statuses: FormOption[];
  allUsers: FormOption[];
  selectedRow: Course | null;
}

export const CourseFormConfig = ({ statuses, allUsers, selectedRow }: CourseFormConfigProps) => {
  const freeItems = [
    { label: "True", value: true },
    { label: "False", value: false },
  ];

  const courseFields = [
    {
      name: "name",
      label: "Course Name",
      placeholder: "Enter course name",
      type: "text",
      required: true,
    },
    {
      name: "title",
      label: "Title",
      placeholder: "Enter course title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter course description",
      type: "textarea",
      required: true,
    },
    {
      name: "status_id",
      label: "Status",
      placeholder: "Select a status of course...",
      type: "select",
      options: statuses,
      required: true,
    },
    {
      name: "owner_id",
      label: "Owner",
      placeholder: "Select a host of course...",
      type: "select",
      options: allUsers,
      required: true,
      castType: "number",
    },
    {
      name: "is_free",
      label: "Is Free",
      placeholder: "Select free",
      type: "select",
      options: freeItems,
      castType: "boolean",
    },
    {
      name: "old_price",
      label: "Old Price",
      placeholder: "Enter old price",
      type: "text",
      required: true,
    },
    {
      name: "new_price",
      label: "New Price",
      placeholder: "Enter new price",
      type: "text",
      required: true,
    },
  ];

  const editDefaultValues = selectedRow
    ? {
        ...selectedRow,
        owner_id: selectedRow.owner_id
          ? allUsers.find((opt) => opt.value === String(selectedRow.owner_id))?.value || ""
          : "",
        status_id: selectedRow.status_id
          ? statuses.find((opt) => opt.value === String(selectedRow.status_id))?.value || ""
          : "",
        is_free: selectedRow?.is_free,
      }
    : {};

  return { courseFields, editDefaultValues };
};