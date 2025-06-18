import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionDivider } from "../common/SectionDivider";
import { DialogTemplateProps } from "./types";
import { renderIcon } from "./IconType";
import AppButton2 from "../bim-viewer/common/AppButton2";
import { toast } from "sonner";

type DialogIconType = "view" | "create" | "edit" | "move" | "delete";

export function DialogTemplate2({
  open,
  onClose,
  title,
  description,
  children,
  disableOutsideClose = false,
  className = "",
  iconType = "view",
  onApply,
  onApplyText,
  onCancelText = "Cancel",
  applyType = "button",
}: DialogTemplateProps & { iconType?: DialogIconType }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    if (!onApply) return;
    try {
      setIsLoading(true);
      await onApply(); // 🔁 Giờ có thể return Promise từ formRef.current?.submit()
    } catch (err) {
      toast.error("Submit failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className={`
          w-full max-w-[100vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl 
          bg-[#F0F5F9] dark:bg-[#020817] flex flex-col
          ${className}
        `}
        style={{ maxHeight: "80vh" }}
        onInteractOutside={(e) => {
          if (disableOutsideClose) e.preventDefault();
        }}
      >
        {renderIcon(iconType)}

        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-base md:text-lg lg:text-xl">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm md:text-base text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <SectionDivider className="mb-2 flex-shrink-0" />

        <div
          className="flex-grow overflow-y-auto p-4 shadow-2xl shadow-zinc-500 rounded-2xl bg-background/50"
          style={{ minHeight: 0 }}
        >
          {children}
        </div>

        <DialogFooter>
          <AppButton2
            falseName={onCancelText}
            btnType="cancel"
            onClick={onClose}
          />
          <AppButton2
            type={applyType}
            isLoading={isLoading}
            btnType={onApplyText}
            onClick={handleApply}
            trueName="Running..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
