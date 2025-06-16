import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

interface EntityDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  entityName?: string; 
}

export const EntityDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  entityName = "this item",
}: EntityDeleteDialogProps) => (
  <ConfirmDeleteDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    itemName={entityName}
  />
);
