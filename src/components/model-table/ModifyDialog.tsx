import { FormDialogTemplate } from "@/components/common/FormDialogTemplate";
import { Model } from "./types";
import { apiRequest } from "@/api";

const fields = [
  { name: "filename", label: "Filename", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "status", label: "Status", type: "text" },
];

export function ModifyDialog({ open, onClose, selectedRow, refeshData }: {
  open: boolean;
  onClose: () => void;
  selectedRow: Model | null;
  refeshData: () => void;
}) {
  const initialValues = selectedRow
    ? {
        filename: selectedRow.name,
        description: "",
        isPublic: selectedRow.status === "Public",
        status: selectedRow.status,
      }
    : {};

  return (
    <FormDialogTemplate
      open={open}
      onClose={onClose}
      title="Update Media"
      fields={fields}
      initialValues={initialValues}
      onSubmit={async (values) => {
        if (!selectedRow) return;
        await apiRequest(`/media/${selectedRow.id}`, "PATCH", values);
        refeshData();
      }}
    />
  );
}
