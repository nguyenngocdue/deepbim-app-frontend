import { Lesson } from "./types";

interface FormOption {
  label: string;
  value: string | boolean;
}

interface LessonFormConfigProps {
  allUsers: FormOption[];
  selectedRow: Lesson | null;
  allCourses: FormOption[];
  sections: FormOption[];
}

export const LessonFormConfig = ({ allUsers, selectedRow, allCourses, sections }: LessonFormConfigProps) => {
  const lockOptions = [
    { label: "Locked", value: true },
    { label: "Unlocked", value: false },
  ];



  const lessonFields = [
    {
      name: "name",
      label: "Lesson Name",
      placeholder: "Enter lesson name",
      type: "text",
      required: true,
    },
    {
      name: "title",
      label: "Title",
      placeholder: "Enter lesson title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter lesson description",
      type: "textarea",
    },
    {
      name: "video_url",
      label: "Video URL",
      placeholder: "Enter video URL",
      type: "text",
    },
    {
      name: "duration",
      label: "Duration",
      placeholder: "e.g. 15:30",
      type: "text",
    },
    {
      name: "order_index",
      label: "Order Index",
      placeholder: "Enter display order",
      type: "number",
      castType: "number",
    },
    {
      name: "content",
      label: "Lesson Content",
      placeholder: "Write lesson content...",
      type: "textarea",
    },
    {
      name: "is_locked",
      label: "Is Locked",
      placeholder: "Choose lock state",
      type: "select",
      options: lockOptions,
      castType: "boolean",
    },
    {
      name: "owner_id",
      label: "Owner",
      placeholder: "Select a lesson owner...",
      type: "select",
      options: allUsers,
      castType: "number",
    },
    {
      name: "course_id",
      label: "Course",
      placeholder: "Select a course...",
      type: "select",
      options: allCourses,
      castType: "number",
      required: true,
    },
    {
      name: "section_id",
      label: "Section",
      placeholder: "Select a section...",
      type: "select",
      options: sections,
      castType: "number",
    },
  ];


  const editDefaultValues = selectedRow
    ? {
      ...selectedRow,
      owner_id: selectedRow.owner_id
        ? allUsers.find((opt) => opt.value === String(selectedRow.owner_id))?.value || ""
        : "",
      course_id: selectedRow.course_id
        ? allCourses.find((opt) => opt.value === String(selectedRow.course_id))?.value || ""
        : "",
      section_id: selectedRow.section_id
        ? sections.find((opt) => opt.value === String(selectedRow.section_id))?.value || ""
        : "",
    }
    : {};


  return { lessonFields, editDefaultValues };
};