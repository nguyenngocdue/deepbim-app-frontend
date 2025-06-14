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
      name: "status_id",
      label: "Status",
      placeholder: "Select enrollment status...",
      type: "select",
      options: statuses,
      required: true,
      castType: "number",
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
