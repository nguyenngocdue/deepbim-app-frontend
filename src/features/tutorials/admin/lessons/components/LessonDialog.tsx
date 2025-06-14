import { useRef } from "react";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { EntityForm } from "@/components/bim-viewer/common/EntityForm";
import { Lesson, FormOption } from "./types";
import { LessonFormConfig } from "./LessonFormConfig";

type Mode = "create" | "edit" | "view" | null;

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
  const formRef = useRef<{ submit: () => void }>(null);

  const { lessonFields, editDefaultValues } = LessonFormConfig({
    allUsers, selectedRow, allCourses,sections
  });


  return (
    <DialogTemplate
      open={modalOpen}
      onClose={closeModal}
      title={mode === "edit" ? "Edit Lesson" : mode === "view" ? "View Lesson" : "Create New Lesson"}
      description={
        mode === "edit" ? "Update course details." : mode === "view" ? "View course details." : "Fill in details to create new course."
      }
      disableOutsideClose
      iconType={mode}
      className="max-w-3xl"
      onApply={() => formRef.current?.submit()}
      onApplyText="Apply"
      onCancelText="Cancel"
      applyType="button"
    >
      <EntityForm
        ref={formRef}
        fields={lessonFields}
        defaultValues={editDefaultValues}
        onSubmit={handleSubmit}
        mode={mode}
        onCancel={closeModal}
        cancelLabel="Cancel"
        showFooter
      />
    </DialogTemplate>
  );
};