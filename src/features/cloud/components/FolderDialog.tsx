import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import React, { useEffect, useState } from "react";
import { FolderData, FolderDialogProps } from "./Type";
import { getFoldersBySubProjectId } from "@/apis/folder-api";
import { IoCreateOutline } from "react-icons/io5";
import { FormActionButtons } from "@/components/bim-viewer/common/FormActionButtons";
import { CLASS_NAME_DEFAULT } from "@/utils/class";

export const FolderDialog: React.FC<FolderDialogProps> = ({
  open,
  onClose,
  onSubmit,
  selectedFolder,
  entityId,
}) => {
  const [availableFolders, setAvailableFolders] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FolderData>({
    name: "",
    sub_project_id: entityId,
    parent_id: selectedFolder?.data?.id ?? null,
  });

  const [error, setError] = useState<string | null>(null);

  // Fetch folder list mỗi lần open dialog
  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await getFoldersBySubProjectId(entityId);
      setAvailableFolders(folders.data);
    };
    if (open) fetchFolders();
  }, [open, entityId]);

  // Reset form khi open dialog
  useEffect(() => {
    setForm({
      name: "",
      sub_project_id: Number(entityId),
      parent_id: Number(selectedFolder?.data?.id) ?? null,
    });
    setError(null);
  }, [entityId, selectedFolder, open]);

  // Validate tên folder
  const validate = (): boolean => {
    if (!form.name || form.name.trim().length < 2) {
      setError("Folder name must be at least 2 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error: any) {
      setError(error?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const isNameInvalid = !form.name || form.name.trim().length < 2;

  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title="Create New Folder"
      description="Fill in the name for your new folder and select its parent folder."
      disableOutsideClose
      className="max-w-md"
      iconType="create"
      footer={
        <FormActionButtons
          onCancel={onClose ?? (() => {})}
          onCancelText="Cancel"
          onApplyText="Create New Folder"
          onApply={handleSubmit}
          disabled={isNameInvalid || loading}
          loading={loading}
          onApplyIcon={<IoCreateOutline />}
          classNameDelete={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_DELETE}
          classNameApply={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}
        />
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
        <div>
          <label
            htmlFor="folderName"
            className="block mb-1 text-sm font-medium text-reverse text-left flex items-center gap-1"
          >
            Folder Name
            <span className="text-red-600">*</span>
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
            className={`w-full border rounded px-3 py-2 text-zinc-800 ${
              isNameInvalid ? "border-red-500" : ""
            }`}
          />
          {/* Hiển thị lỗi ngay dưới input */}
          {error && (
            <p className="mt-1 text-sm text-left text-red-600 font-medium">
              {error}
            </p>
          )}
        </div>
      </div>
    </DialogTemplate>
  );
};
