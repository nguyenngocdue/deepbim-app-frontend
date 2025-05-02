import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Button, buttonVariants } from "@/components/ui/button";
  import { ExternalLink, Trash, X, OctagonAlert } from "lucide-react";
  
  interface AlertDialogTemplateProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    learnMoreLink?: string;
  }
  
  export const AlertDialogTemplate = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Delete",
    cancelText = "Cancel",
    learnMoreLink,
  }: AlertDialogTemplateProps) => {
    return (
      <AlertDialog open={open} onOpenChange={onClose} >
        <AlertDialogContent className="overflow-hidden border-zinc-600 bg-behind">
          <AlertDialogHeader className="pb-4">
            <AlertDialogTitle>
              <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 dark:bg-red-900/10">
                <OctagonAlert className="h-5 w-5 text-red-500 dark:text-red-900" />
              </div>
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px]">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
  
          <AlertDialogFooter className="border-t -mx-6 -mb-6 px-6 py-5 border-zinc-800">
            {learnMoreLink && (
              <Button
                variant="link"
                className="-ml-3 mr-auto text-zinc-500 dark:text-zinc-400"
                onClick={() => window.open(learnMoreLink, "_blank")}
              >
                Learn More <ExternalLink className="ml-1" />
              </Button>
            )}
  
            <AlertDialogCancel onClick={onClose}>
              <X className="mr-1" />
              {cancelText}
            </AlertDialogCancel>
  
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={onConfirm}
            >
              <Trash className="mr-1" />
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  