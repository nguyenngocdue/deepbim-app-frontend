import { EntityDialog } from "@/features/tutorials/functions/EntityDialog";
import { EnrollmentFormConfig } from "./EnrollmentsFormConfig";
import { Enrollment, FormOption, Mode } from "./types";

interface EnrollmentDialogProps {
  mode: Mode;
  modalOpen: boolean;
  selectedRow: Enrollment | null;
  allUsers: FormOption[];
  allCourses: FormOption[];
  statuses: FormOption[];
  closeModal: () => void;
  handleSubmit: (formData: any) => void;
  fetchFormData?: () => void;
}

export const EnrollmentDialog = ({
  mode,
  modalOpen,
  selectedRow,
  allUsers,
  allCourses,
  statuses,
  closeModal,
  handleSubmit,
}: EnrollmentDialogProps) => {
  const { formFields, defaultValues } = EnrollmentFormConfig({
    allUsers,
    allCourses,
    statuses,
    selectedRow,
  });

  return (
    <EntityDialog<Enrollment>
      mode={mode}
      open={modalOpen}
      onClose={closeModal}
      onSubmit={handleSubmit}
      fields={formFields}
      defaultValues={defaultValues}
      entityName="Enrollment"
    />
  );
};
