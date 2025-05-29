import AppButton from "@/components/bim-viewer/common/AppButton";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { DialogClose } from "@radix-ui/react-dialog";

export function ImageDialogViewer({
  open,
  onClose,
  url,
  fileName,
  iconType = "show",
  disableOutsideClose = false,
}: {
  open: boolean;
  onClose: () => void;
  url: string;
  fileName?: string;
  iconType?: "show" | "edit" | "create" | "delete" | "update" | "move" | "";
  disableOutsideClose?: boolean;
}) {
  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title={
        <>
          Preview image:{" "}
          <span className="font-normal break-all">{fileName || url}</span>
        </>
      }
      description={fileName}
      iconType={iconType}
      disableOutsideClose={disableOutsideClose}
      className="max-w-[96vw] max-h-[94vh] w-fit items-center "
      footer={
        <DialogClose asChild>
          <AppButton variant="outline" falseName="Close" />
        </DialogClose>
      }
    >
      <div className="flex justify-center items-center w-full h-full" style={{ minHeight: 300 }}>
        <img
          src={url}
          alt={fileName}
          className="rounded-lg shadow max-w-full max-h-[70vh] object-contain bg-white"
          style={{ margin: "0 auto" }}
          loading="lazy"
        />
      </div>
    </DialogTemplate>
  );
}
