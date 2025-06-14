import { useRef } from "react";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { EntityForm } from "@/components/bim-viewer/common/EntityForm";
import { CourseFormConfig } from "./CourseFormConfig";
import { Course, FormOption } from "./types";

type Mode = "create" | "edit" | "view" | null;

interface CourseDialogProps {
  mode: Mode;
  modalOpen: boolean;
  selectedRow: Course | null;
  statuses: FormOption[];
  allUsers: FormOption[];
  closeModal: () => void;
  handleSubmit: (formData: any) => void;
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
  const formRef = useRef<{ submit: () => void }>(null);

  const { courseFields, editDefaultValues } = CourseFormConfig({
    statuses,
    allUsers,
    selectedRow,
  });

  return (
    <DialogTemplate
      open={modalOpen}
      onClose={closeModal}
      title={mode === "edit" ? "Edit Course" : mode === "view" ? "View Course" : "Create New Course"}
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
        fields={courseFields}
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