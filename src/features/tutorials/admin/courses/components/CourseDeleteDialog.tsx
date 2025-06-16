import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

interface CourseDeleteDialogProps {
  modalOpenDel: boolean;
  closeModal: () => void;
  handleDeleteCourse: () => Promise<void>;
}

export const CourseDeleteDialog = ({
  modalOpenDel,
  closeModal,
  handleDeleteCourse,
}: CourseDeleteDialogProps) => (
  <ConfirmDeleteDialog
    open={modalOpenDel}
    onClose={closeModal}
    onConfirm={handleDeleteCourse}
    itemName="this course"
  />
);