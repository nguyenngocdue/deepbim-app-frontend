import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface DialogTemplateProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  disableOutsideClose?: boolean;
  className?: string;
}

export function DialogTemplate({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  disableOutsideClose = false,
  className = "",
}: DialogTemplateProps) {
  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className={`w-full max-w-[100vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl ${className}`}
        onInteractOutside={(e) => {
          if (disableOutsideClose) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg lg:text-xl">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm md:text-base text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4 pr-1">{children}</div>

        {footer && (
          <div className="mt-6 flex flex-col-reverse md:flex-row justify-end gap-2">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
