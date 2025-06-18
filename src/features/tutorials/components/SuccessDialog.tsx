import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppButton2 from "@/components/bim-viewer/common/AppButton2";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SuccessDialog({ open, onClose }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-xs sm:max-w-md p-4 sm:p-6 text-center bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-green-200 dark:border-green-800 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src="https://minio.deepbim.net:9000/deepbim-fe/1749531131956-logo_no_bg.png"
            alt="DeepBIM Logo"
            className="w-16 sm:w-20 h-auto object-contain animate-soft-bounce"
          />
          <span className="mt-2 text-xl sm:text-2xl font-semibold tracking-wide text-gray-800 dark:text-white">
            DeepBIM
          </span>
        </div>

        {/* Title */}
        <DialogHeader className="mt-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-green-600 dark:text-green-400">
            🎉 Thank you for registering!
          </h2>
        </DialogHeader>

        {/* Content */}
        <p className="text-gray-700 dark:text-gray-300 mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">
          We have received your course registration information. <br />
          Your account will be activated once an admin is online.
        </p>

        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3">
          Thank you for trusting DeepBIM!
        </p>

        {/* Footer Button */}
        <DialogFooter className="mt-6">
          <AppButton2
            btnType="ok"
            onClick={onClose}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
