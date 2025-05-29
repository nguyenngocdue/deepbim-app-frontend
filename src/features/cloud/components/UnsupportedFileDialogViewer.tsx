import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import AppButton from "@/components/bim-viewer/common/AppButton";
import { DialogClose } from "@radix-ui/react-dialog";
import { FaDownload } from "react-icons/fa";
import { downloadFile } from "@/utils/file";

export function UnsupportedFileDialogViewer({
  open,
  onClose,
  fileUrl,
  fileName,
}: {
  open: boolean;
  onClose: () => void;
  fileUrl?: string;
  fileName?: string;
}) {
  const handleDownload = () => {
    if (fileUrl) {
      downloadFile(fileUrl, fileName);
    }
  };

  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title={
        <>
          File preview not supported:{" "}
          <span className="font-normal break-all">{fileName || fileUrl}</span>
        </>
      }
      description={fileName}
      iconType="show"
      className="max-w-[420px]"
      footer={
        <>
          <AppButton
            onClick={handleDownload}
            falseName="Download file"
            variant="link"
            icon={<FaDownload/>}
            className="bg-blue-600 hover:bg-blue-600/80"
          />
          <DialogClose asChild>
            <AppButton variant="destructive" falseName="Close"/>
          </DialogClose>
        </>
      }
    >
      <div className="flex flex-col items-center justify-center min-h-[120px] text-center text-base text-gray-700 dark:text-gray-200">
        <span className="font-semibold text-lg mb-2">
          ❗ File type not supported for preview.
        </span>
        <span>
          Please download this file to view it on your device.
        </span>
      </div>
    </DialogTemplate>
  );
}
