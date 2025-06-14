import { EntityDeleteDialog } from "@/features/tutorials/functions/EntityDeleteDialog";

interface EnrollmentDeleteDialogProps {
  modalOpenDel: boolean;
  closeModal: () => void;
  handleDeleteEnrollment: () => Promise<void>;
}

export const EnrollmentDeleteDialog = ({
  modalOpenDel,
  closeModal,
  handleDeleteEnrollment,
}: EnrollmentDeleteDialogProps) => (
  <EntityDeleteDialog
    open={modalOpenDel}
    onClose={closeModal}
    onConfirm={handleDeleteEnrollment}
    entityName="this enrollment"
  />
);
