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
    className = "max-w-2xl",
  }: DialogTemplateProps) {
    return (
      <Dialog open={open} onOpenChange={onClose} modal>
        <DialogContent
          className={className}
          onInteractOutside={(e) => {
            if (disableOutsideClose) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
  
          <div className="mt-4">{children}</div>
  
          {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
        </DialogContent>
      </Dialog>
    );
  }
  