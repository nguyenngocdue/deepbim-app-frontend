import { AlertDialogTemplate } from "./common/AlertDialogTemplate";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  itemName = "this item",
}: ConfirmDeleteDialogProps) => {
  return (
    <AlertDialogTemplate
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Are you absolutely sure?"
      description={`This action cannot be undone. It will permanently delete ${itemName} from the system.`}
      confirmText="Delete"
      cancelText="Cancel"
      learnMoreLink="https://help.deepbim.net/deletion-policy"
    />
  );
};
