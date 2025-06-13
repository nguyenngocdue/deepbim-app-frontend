// components/SuccessDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SuccessDialog({ open, onClose }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-6 text-center bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-green-200 dark:border-green-800">
        {/* Logo */}
         <div className="flex flex-col items-center">
              <img
                src="https://minio.deepbim.net:9000/deepbim-fe/1749531131956-logo_no_bg.png"
                alt="DeepBIM Logo"
                className="w-20 sm:w-24 h-auto object-contain animate-soft-bounce"
              />
              <span className="mt-2 text-2xl sm:text-3xl font-semibold tracking-wide text-white">
                DeepBIM
              </span>
            </div>

        <DialogHeader>
          <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400">
            🎉 Cảm ơn bạn đã đăng ký!
          </h2>
        </DialogHeader>

        <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm leading-relaxed">
          Chúng tôi đã nhận được thông tin đăng ký khóa học của bạn.<br />
          Tài khoản sẽ được kích hoạt khi quản trị viên online.
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Xin chân thành cảm ơn vì đã tin tưởng DeepBIM!
        </p>

        <DialogFooter className="mt-6">
          <Button
            onClick={onClose}
            className="mx-auto bg-green-600 text-white hover:bg-green-700"
          >
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
