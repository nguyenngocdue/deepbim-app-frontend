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
  applyType = "button",
}: DialogTemplateProps & { iconType?: DialogIconType }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    if (!onApply) return;
    setIsLoading(true);
    try {
      await onApply(); // Execute the provided onApply callback
    } catch (error) {
      console.error("Error during apply:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const renderIcon = () => {
    switch (iconType) {
      case "create":
        return <LucideGitPullRequestCreateArrow className="h-5 w-5 text-blue-500 dark:text-green-900" />;
      case "move":
        return <TiArrowMoveOutline className="h-5 w-5 text-blue-500 dark:text-green-900" />;
      case "edit":
        return <LuPencil className="h-5 w-5 text-yellow-500 dark:text-yellow-900" />;
      case "delete":
        return <LuTrash2 className="h-5 w-5 text-red-500 dark:text-red-900" />;
      case "view":
        return <BiSolidShow className="h-5 w-5 text-indigo-500 dark:text-indigo-700" />;
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
        style={{ maxHeight: "80vh" }}
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

        {/* Container for children with scroll */}
        <div
          className="flex-grow overflow-y-auto p-4 shadow-2xl shadow-zinc-500 rounded-2xl bg-background/50"
          style={{ minHeight: 0 }}
        >
          {children}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">
              <X className="mr-1" />
              {onCancelText}
            </Button>
          </DialogClose>
          <Button
            type={applyType}
            onClick={handleApply}
            className="bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-600/60 text-white dark:text-white"
            disabled={isLoading || !onApply}
            aria-label={isLoading ? "Applying changes" : onApplyText}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
                Applying...
              </span>
            ) : (
              <>
                <GrUpdate className="mr-2 h-4 w-4" />
                {onApplyText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}