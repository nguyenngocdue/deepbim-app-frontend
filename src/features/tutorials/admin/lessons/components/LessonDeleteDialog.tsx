import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

interface LessonDeleteDialogProps {
  modalOpenDel: boolean;
  closeModal: () => void;
  handleDeleteLesson: () => Promise<void>;
}

export const LessonDeleteDialog = ({
  modalOpenDel,
  closeModal,
  handleDeleteLesson,
}: LessonDeleteDialogProps) => (
  <ConfirmDeleteDialog
    open={modalOpenDel}
    onClose={closeModal}
    onConfirm={handleDeleteLesson}
    itemName="this lesson"
  />
);