"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, X, FileEdit } from "lucide-react";
import { useState, useEffect } from "react";

type FieldType = "text" | "textarea" | "switch";

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
}

interface FormAlertDialogTemplateProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  title: string;
  fields: FieldConfig[];
  initialValues: Record<string, any>;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const FormAlertDialogTemplate = ({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  initialValues,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
}: FormAlertDialogTemplateProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues, open]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="overflow-hidden border-zinc-600 bg-behind">
        <AlertDialogHeader className="pb-4">
          <AlertDialogTitle>
            <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-900/10">
              <FileEdit className="h-5 w-5 text-blue-500 dark:text-blue-900" />
            </div>
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>

        {/* Form */}
        <div className="space-y-5 py-2 text-left">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col items-start">
              <label className="text-sm font-medium mb-2 text-zinc-500">{field.label}</label>

              {field.type === "text" && (
                <Input
                  value={formData[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  value={formData[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <AlertDialogFooter className="border-t -mx-6 -mb-6 px-6 py-5 border-zinc-800">
          <AlertDialogCancel onClick={onClose} disabled={loading}>
            <X className="mr-1" />
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "secondary" })}
            onClick={handleSubmit}
            disabled={loading}
          >
            <Save className="mr-1" />
            {loading ? "Saving..." : submitText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
