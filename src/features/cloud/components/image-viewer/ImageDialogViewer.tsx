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
  width = 700,  
  height = 500,  
}: {
  open: boolean;
  onClose: () => void;
  url: string;
  fileName?: string;
  iconType?: "show";
  disableOutsideClose?: boolean;
  width?: number;
  height?: number;
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
      className="max-w-[96vw] max-h-[94vh] w-fit items-center"
      footer={
        <DialogClose asChild>
          <AppButton variant="outline" falseName="Close" />
        </DialogClose>
      }
    >
      <div
        className="flex justify-center items-center"
        style={{
          width,
          height,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 18px #2221",
          minHeight: height,
          minWidth: width,
          maxWidth: "90vw",
          maxHeight: "70vh",
        }}
      >
        <img
          src={url}
          alt={fileName}
          className="rounded-lg shadow object-contain"
          style={{
            width: "100%",
            height: "100%",
            maxWidth: width,
            maxHeight: height,
            display: "block",
            objectFit: "contain",
            background: "#fff"
          }}
          loading="lazy"
        />
      </div>
    </DialogTemplate>
  );
}
