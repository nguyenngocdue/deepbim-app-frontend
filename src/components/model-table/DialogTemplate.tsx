import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import { Separator } from "../ui/separator";
import { LuPencil, LuTrash2, LuRefreshCw } from "react-icons/lu";
import { LucideGitPullRequestCreateArrow } from "lucide-react";
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import { TiArrowMoveOutline } from "react-icons/ti";

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

type IconType = "" | "create" | "edit" | "delete" | "update" | "show" | "move";

export function DialogTemplate({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  disableOutsideClose = false,
  className = "",
  iconType = "",
}: DialogTemplateProps & { iconType?: IconType }) {
  const renderIcon = () => {
    switch (iconType) {
      case "create":
        return <LucideGitPullRequestCreateArrow className="h-5 w-5 text-blue-500 dark:text-green-900" />;
      case "move":
        return <TiArrowMoveOutline  className="h-5 w-5 text-blue-500 dark:text-green-900" />;
      case "edit":
        return <LuPencil className="h-5 w-5 text-yellow-500 dark:text-yellow-900" />;
      case "delete":
        return <LuTrash2 className="h-5 w-5 text-red-500 dark:text-red-900" />;
      case "update":
        return <LuRefreshCw className="h-5 w-5 text-green-500 dark:text-green-900" />;
      case "show":
        return <SiGoogledisplayandvideo360  className="h-5 w-5 text-indigo-500 dark:text-indigo-700" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className={`w-full max-w-[100vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl ${className} bg-[#F0F5F9] dark:bg-[#020817]`}
        onInteractOutside={(e) => {
          if (disableOutsideClose) e.preventDefault();
        }}
      >
        {renderIcon()}
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg lg:text-xl ">
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
