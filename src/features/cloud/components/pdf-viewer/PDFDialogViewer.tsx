import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PDFViewer from "./PDFViewer";

interface PDFDialogViewerProps {
  open: boolean;
  onClose: (open: boolean) => void;
  url: string;
  fileName?: string;
}

export function PDFDialogViewer({ open, onClose, url, fileName }: PDFDialogViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[96vw] max-h-[94vh] w-fit bg-background"
        style={{
          padding: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            Preview file: <span className="font-normal">{fileName || url}</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            You can scroll, zoom, or browse through the PDF pages below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex justify-center items-center p-4 overflow-auto">
          <PDFViewer url={url} maxWidth={900} maxHeight={650} />
        </div>
        <DialogFooter className="flex justify-end gap-2 px-6 pb-6">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
