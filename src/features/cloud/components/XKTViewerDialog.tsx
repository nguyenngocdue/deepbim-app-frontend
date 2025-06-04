import { DialogTemplate } from "@/components/model-table/DialogTemplate";

export function XKTViewerDialog({
  open,
  onClose,
  selectedFile,
}: {
  open: boolean;
  onClose: () => void;
  selectedFile: any;
}) {
  if (!selectedFile) return null;

  const fileCode = selectedFile.media.view_id;

  const handleOpenViewer = () => {
    onClose();
    // window.open(`/view?v=${fileCode}`, "_blank");
    window.open(`/view2/show-file?v=${fileCode}`, "_blank");
  };

  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title="View IFC Model"
      description={selectedFile.name}
      iconType="view"
      onApply={handleOpenViewer}
      onApplyText="View Model"
    >
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-2">
          <img src="/images/ifc_icon.png" alt="IFC" className="w-10 h-10" />
        </div>
        <div className="text-center">
          <div className="font-semibold">{selectedFile.name}</div>
        </div>
      </div>
    </DialogTemplate>
  );
}
