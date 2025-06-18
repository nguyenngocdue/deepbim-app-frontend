import { EntityDialog } from "@/features/tutorials/functions/EntityDialog";
import { CourseFormConfig } from "./CourseFormConfig";
import { Course, FormOption, Mode } from "./types";

interface CourseDialogProps {
  mode: Mode;
  modalOpen: boolean;
  selectedRow: Course | null;
  statuses: FormOption[];
  allUsers: FormOption[];
  closeModal: () => void;
  handleSubmit: (formData: any) => void;
  fetchFormData?: () => void;
}

export const CourseDialog = ({
  mode,
  modalOpen,
  selectedRow,
  statuses,
  allUsers,
  closeModal,
  handleSubmit,
}: CourseDialogProps) => {
  const { courseFields, editDefaultValues } = CourseFormConfig({
    statuses,
    allUsers,
    selectedRow,
  });

  return (
    <EntityDialog<Course>
      mode={mode}
      open={modalOpen}
      onClose={closeModal}
      onSubmit={handleSubmit}
      fields={courseFields}
      defaultValues={editDefaultValues}
      entityName="Course"
    />
  );
};
