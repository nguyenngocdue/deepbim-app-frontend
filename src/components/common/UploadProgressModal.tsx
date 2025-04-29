import React, { useEffect, useState, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type UploadProgressModalProps = {
  open: boolean;
  progress: number; // ❗️ chỉ cần progress, bỏ currentStep
};

export const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  open,
  progress,
}) => {
  const [internalOpen, setInternalOpen] = useState(open);

  // 🚀 Tự động tính step từ progress
  const currentStep = useMemo(() => {
    if (progress >= 95) return 3;
    if (progress >= 50) return 2;
    return 1;
  }, [progress]);

  useEffect(() => {
    setInternalOpen(open); // đồng bộ open

    if (open && progress === 100) {
      const timeout = setTimeout(() => {
        setInternalOpen(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [open, progress]);

  return (
    <AlertDialog open={internalOpen}>
      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center " />
        <AlertDialogContent
          className={cn(
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "max-w-md w-full border-none shadow-2xl rounded-xl p-8 bg-white",
            "flex flex-col items-center justify-center gap-8",
            "transition-all duration-300 ease-in-out bg-behind"
          )}
        >
          {/* Header */}
          <AlertDialogHeader className="flex flex-col items-center space-y-2 text-center">
            <AlertDialogTitle className="text-xl font-semibold text-50">
              Uploading Your File
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Please do not close or reload this page.
            </AlertDialogDescription>
          </AlertDialogHeader>


          {/* Steps */}
          <div className="flex w-full items-center justify-between">
            <StepCircle label="Uploading" number={1} active={currentStep >= 1} />
            <StepConnector active={currentStep >= 2} />
            <StepCircle label="Processing" number={2} active={currentStep >= 2} />
            <StepConnector active={currentStep >= 3} />
            <StepCircle label="Complete" number={3} active={currentStep >= 3} />
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Reminder Text */}
          <div className="text-center text-sm leading-relaxed">
            <p className="font-medium text-gray-500">Your file is being uploaded.</p>
            <p className="text-xs text-gray-500">Do not close or reload this page.</p>
            <p className="text-xs  mt-2 italic text-zinc-400">
              After the upload completes, we will send an email so you can check and experience your model.
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

// StepCircle và StepConnector giữ nguyên
type StepCircleProps = {
  label: string;
  number: number;
  active: boolean;
};

const StepCircle: React.FC<StepCircleProps> = ({ label, number, active }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={cn(
        "w-12 h-12 rounded-full border-2 flex items-center justify-center text-base font-bold",
        active ? "border-blue-600 text-blue-600" : "border-gray-300 text-gray-400",
        "transition-all duration-300"
      )}
    >
      {number}
    </div>
    <span
      className={cn(
        "text-xs font-medium",
        active ? "text-blue-600" : "text-gray-400",
        "transition-colors duration-300"
      )}
    >
      {label}
    </span>
  </div>
);

type StepConnectorProps = {
  active: boolean;
};

const StepConnector: React.FC<StepConnectorProps> = ({ active }) => (
  <div
    className={cn(
      "flex-1 h-0.5 mx-2",
      active ? "bg-blue-600" : "bg-gray-300",
      "transition-colors duration-300"
    )}
  />
);
