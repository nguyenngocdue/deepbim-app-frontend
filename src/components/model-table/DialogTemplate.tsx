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
import { LucideGitPullRequestCreateArrow, X } from "lucide-react";
import { TiArrowMoveOutline } from "react-icons/ti";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { BiSolidShow } from "react-icons/bi";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { GrUpdate } from "react-icons/gr";

type DialogIconType = "view" | "create" | "edit" | "move" | "delete";

export function DialogTemplate({
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
  applyType = 'button',

}: DialogTemplateProps & { iconType?: DialogIconType }) {
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
        case "view":
          return <BiSolidShow   className="h-5 w-5 text-indigo-500 dark:text-indigo-700" />;
        default:
          return null;
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
          className="flex-grow overflow-y-auto  p-4  shadow-2xl shadow-zinc-500 rounded-2xl bg-background/50"
          style={{ minHeight: 0 }} // rất quan trọng để flex-grow hoạt động đúng trong container flex
        >
          {children}
        </div>
      <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive"><X className="mr-1" />{onCancelText}</Button>
            </DialogClose>
            <Button type={applyType} onClick={onApply} className="bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-600/60 text-white dark:text-white"><GrUpdate />{onApplyText}</Button>
          </DialogFooter>
      </DialogContent>

    </Dialog>
  );
}
