import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import React from "react";
import { FolderData, FolderDialogProps } from "./Type";

export const FolderDialog: React.FC<FolderDialogProps> = ({ open, onClose, onSubmit, selectedFolder, entityId }) => {
  const [form, setForm] = React.useState<FolderData>({
    name: "",
    sub_project_id: entityId,
    parent_id: selectedFolder?.data.id,
  });

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setForm({
      name: "",
      sub_project_id: Number(entityId),
      parent_id: Number(selectedFolder?.data.id),
    });
    setError(null);
  }, [entityId, selectedFolder, open]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Folder name is required");
      return;
    }
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.message?.[0] || "Something went wrong.";
      setError(message);
    }
  };

  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title="Create New Folder"
      description="Fill in the name for your new folder."
      disableOutsideClose
      className="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Create
          </button>
        </>
      }
    >
      <div className="space-y-2">
        {error && <p className="text-sm text-left text-red-600 mt-1">{error}</p>}
        <input
          type="text"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            if (error) setError(null);
          }}
          placeholder="Folder name"
          className="w-full border rounded px-3 py-2 text-zinc-800"
        />
      </div>
    </DialogTemplate>
  );
};