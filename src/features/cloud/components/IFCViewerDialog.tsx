import { useNavigate } from "@tanstack/react-router";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import AppButton from "@/components/bim-viewer/common/AppButton";

export function IFCViewerDialog({
  open,
  onClose,
  selectedFile,
}: {
  open: boolean;
  onClose: () => void;
  selectedFile: any;
}) {
  const navigate = useNavigate();
  if (!selectedFile) return null;

  const fileCode = selectedFile.media.view_id;

  const handleOpenViewer = () => {
    onClose();
    window.open(`/view?v=${fileCode}`, "_blank");
  };

  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title="View IFC Model"
      description={selectedFile.name}
      iconType="show"
      footer={
        <>
          <AppButton onClick={onClose} falseName="Cancel"  variant="destructive"/>
          <AppButton onClick={handleOpenViewer} falseName="Open in Viewer" variant="default" className="dark:bg-blue-600 dark:text-gray-100"/>
        </>
      }
    >
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-2">
          {/* Nếu muốn icon hoặc thumbnail, thay vào đây */}
          <img src="/images/ifc_icon.png" alt="IFC" className="w-10 h-10" />
        </div>
        <div className="text-center">
          <div className="font-semibold">{selectedFile.name}</div>
        </div>
        {/* Thêm info khác nếu cần */}
      </div>
    </DialogTemplate>
  );
}
