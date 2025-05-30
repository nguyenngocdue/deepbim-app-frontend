import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionDivider } from "../common/SectionDivider";
import { IconType } from "react-icons/lib";

export function DialogTemplate({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  disableOutsideClose = false,
  className = "",
}: DialogTemplateProps & { iconType?: IconType }) {
  const renderIcon = () => {
    // giữ nguyên
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className={`
          w-full max-w-[100vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl 
          bg-[#F0F5F9] dark:bg-[#020817] flex flex-col
          ${className}
        `}
        style={{ maxHeight: "80vh" }} // giới hạn chiều cao dialog
        onInteractOutside={(e) => {
          if (disableOutsideClose) e.preventDefault();
        }}
      >
        {renderIcon()}

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

        {/* Container children scroll */}
        <div
          className="flex-grow overflow-y-auto pr-1  p-2  shadow-lg shadow-zinc-500 rounded-2xl"
          style={{ minHeight: 0 }} // rất quan trọng để flex-grow hoạt động đúng trong container flex
        >
          {children}
        </div>
        {footer && (
          <div className="mt-2 flex flex-col-reverse md:flex-row justify-end gap-2 flex-shrink-0">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
