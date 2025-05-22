import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormActionButtonsProps {
  onCancel: () => void;
  onApply?: () => void;
  onCancelText?: string;
  onApplyText?: string;
  cancelType?: "button" | "submit" | "reset";
  applyType?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onApplyIcon?: React.ReactNode;
  onCancelIcon?: React.ReactNode;
  classNameDelete?: string;
  classNameApply?: string;
}

export const FormActionButtons: React.FC<FormActionButtonsProps> = ({
  onCancel,
  onApply,
  onCancelText = "Cancel",
  onApplyText = "Create",
  cancelType = "button", // default
  applyType = "submit",  // default để tiện xài với form
  disabled = false,
  loading = false,
  onApplyIcon,
  onCancelIcon,
  classNameDelete = "",
  classNameApply = "",
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        className={classNameDelete}
        type={cancelType}
        onClick={onCancel}
      >
        {onCancelIcon ? onCancelIcon : <X className="mr-1" />}
        {onCancelText}
      </Button>
      <Button
        className={classNameApply}
        type={applyType}
        onClick={onApply}
        disabled={disabled}
      >
        {onApplyIcon}
        {loading ? "Processing..." : onApplyText}
      </Button>
    </div>
  );
};
