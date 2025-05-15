import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import React, { useEffect } from "react";
import { FolderData, FolderDialogProps } from "./Type";
import { getFoldersBySubProjectId } from "@/apis/folder-api";

export const FolderDialog: React.FC<FolderDialogProps> = ({
  open,
  onClose,
  onSubmit,
  selectedFolder,
  entityId,
}) => {

  const [availableFolders, setAvailableFolders] = React.useState<FolderData[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await getFoldersBySubProjectId(entityId);
      setAvailableFolders(folders.data);
    };
    fetchFolders();
  }, [entityId]);


  const [form, setForm] = React.useState<FolderData>({
    name: "",
    sub_project_id: entityId,
    parent_id: selectedFolder?.data.id ?? null,
  });

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setForm({
      name: "",
      sub_project_id: Number(entityId),
      parent_id: Number(selectedFolder?.data.id) ?? null,
    });
  }, [entityId, selectedFolder, open]);

  const handleSubmit = async () => {
    try {
      await onSubmit(form);  // gọi api
      onClose();            // đóng form khi thành công
    } catch (error: any) {
      setError(error?.message || "Something went wrong");
    }
  };


  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title="Create New Folder"
      description="Fill in the name for your new folder and select its parent folder."
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
      <div className="space-y-4">
        {/* Dropdown chọn Parent Folder */}
        <div>
          <label
            htmlFor="parentFolder"
            className="block mb-1 text-sm font-medium text-left text-reverse"
          >
            Parent Folder
          </label>
          <select
            id="parentFolder"
            value={form.parent_id !== null ? String(form.parent_id) : ""}
            onChange={(e) => {
              const val = e.target.value;
              setForm({
                ...form,
                parent_id: val === "" ? null : Number(val),
              });
              if (error) setError(null);
            }}
            className="w-full border rounded px-3 py-2 text-zinc-800"
          >
            <option value="">-- No parent (root folder) --</option>
            {availableFolders.map((folder) => (
              <option key={folder?.id} value={folder?.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input tên folder */}
        <label
          htmlFor="folderName"
          className="block mb-1 text-sm font-medium text-reverse text-left"
        >
          Folder Name
        </label>
        <input
          id="folderName"
          type="text"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            if (error) setError(null);
          }}
          placeholder="Folder name"
          className="w-full border rounded px-3 py-2 text-zinc-800"
        />
        {/* Hiển thị lỗi ngay dưới input */}
        {error && (
          <p className="mt-1 text-sm text-left text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>
    </DialogTemplate>
  );
};
