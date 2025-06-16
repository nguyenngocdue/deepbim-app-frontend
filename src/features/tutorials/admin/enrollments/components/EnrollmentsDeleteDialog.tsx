import { EntityDeleteDialog } from "@/features/tutorials/functions/EntityDeleteDialog";

interface EnrollmentDeleteDialogProps {
  modalOpenDel: boolean;
  closeModal: () => void;
  onConfirm: () => Promise<void>; // ✅ đổi tên chuẩn
}

export const EnrollmentDeleteDialog = ({
  modalOpenDel,
  closeModal,
  onConfirm,
}: EnrollmentDeleteDialogProps) => (
  <EntityDeleteDialog
    open={modalOpenDel}
    onClose={closeModal}
    onConfirm={onConfirm}
    entityName="this enrollment"
  />
);
