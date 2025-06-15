import { BuildFormConfig, FieldConfig } from "@/features/tutorials/functions/BuildFormConfig";
import { Enrollment, FormOption } from "./types";

interface EnrollmentFormConfigProps {
  allUsers: FormOption[];
  allCourses: FormOption[];
  statuses: FormOption[];
  selectedRow: Enrollment | null;
}

export const EnrollmentFormConfig = ({
  allUsers,
  allCourses,
  statuses,
  selectedRow,
}: EnrollmentFormConfigProps) => {

  const fields: FieldConfig[] = [
    {
      name: "user_id",
      label: "User",
      placeholder: "Select user...",
      type: "select",
      options: allUsers,
      required: true,
      castType: "number",
    },
    {
      name: "course_id",
      label: "Course",
      placeholder: "Select course...",
      type: "select",
      options: allCourses,
      required: true,
      castType: "number",
    },
      {
      name: "email",
      label: "Email",
      placeholder: "Enter your email...",
      type: "text",
      options: allCourses,
      required: true,
    },
    {
      name: "status_id",
      label: "Status",
      placeholder: "Select enrollment status...",
      type: "select",
      options: statuses,
      required: true,
      castType: "number",
    },
    {
      name: "full_name",
      label: "Full Name",
      placeholder: "Enter display order...",
      type: "text",
      required: true,
    },
      {
      name: "linked_link",
      label: "Linked Link",
      placeholder: "Enter Linked link...",
      type: "text",
    },
    {
     name: "zalo_link",
     label: "Zalo Link",
     placeholder: "Enter Zalo link ...",
     type: "text",
   },
      {
      name: "phone",
      label: "Phone",
      placeholder: "Enter phone number ...",
      type: "text",
    },
  ];

  return BuildFormConfig<Enrollment>({
    selectedRow,
    fields,
    selectMap: {
      user_id: allUsers,
      course_id: allCourses,
      status_id: statuses,
    },
  });
};
