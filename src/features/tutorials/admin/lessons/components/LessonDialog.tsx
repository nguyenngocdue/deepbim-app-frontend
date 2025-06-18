import { EntityDialog } from "@/features/tutorials/functions/EntityDialog";
import { LessonFormConfig } from "./LessonFormConfig";
import { Lesson, FormOption, Mode } from "./types";

interface LessonDialogProps {
  mode: Mode;
  modalOpen: boolean;
  selectedRow: Lesson | null;
  allUsers: FormOption[];
  allCourses: FormOption[];
  sections: FormOption[];
  closeModal: () => void;
  handleSubmit: (formData: any) => void;
}

export const LessonDialog = ({
  mode,
  modalOpen,
  selectedRow,
  allUsers,
  allCourses,
  sections,
  closeModal,
  handleSubmit,
}: LessonDialogProps) => {
  const { lessonFields, editDefaultValues } = LessonFormConfig({
    allUsers,
    selectedRow,
    allCourses,
    sections,
  });

  return (
    <EntityDialog<Lesson>
      mode={mode}
      open={modalOpen}
      onClose={closeModal}
      onSubmit={handleSubmit}
      fields={lessonFields}
      defaultValues={editDefaultValues}
      entityName="Lesson"
    />
  );
};
