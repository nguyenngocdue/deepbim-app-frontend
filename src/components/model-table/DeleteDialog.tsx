import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { apiRequest } from "@/api";
import { Model } from "./types";

export function DeleteDialog({ open, onClose, selectedRow, refeshData }: {
  open: boolean;
  onClose: () => void;
  selectedRow: Model | null;
  refeshData: () => void;
}) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={async () => {
        if (!selectedRow) return;
        await apiRequest(`/media/${selectedRow.id}`, "DELETE");
        onClose();
        refeshData();
      }}
      itemName={selectedRow?.name}
    />
  );
}
