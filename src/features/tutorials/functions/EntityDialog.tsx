// components/common/EntityDialog.tsx
import { useRef } from "react";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { EntityForm } from "@/components/bim-viewer/common/EntityForm";
import { FieldConfig } from "@/components/bim-viewer/common/EntityForm/types";
import { DialogTemplate2 } from "@/components/model-table/DialogTemplate2";

export type Mode = "create" | "edit" | "view" | null;

interface EntityDialogProps<T> {
  mode: Mode;
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  title?: string;
  description?: string;
  entityName?: string;
  fields: FieldConfig[];
  defaultValues: Partial<T>;
  maxWidth?: string;
}

export function EntityDialog<T>({
  mode,
  open,
  onClose,
  onSubmit,
  title,
  description,
  entityName = "item",
  fields,
  defaultValues,
  maxWidth = "max-w-3xl",
}: EntityDialogProps<T>) {
 const formRef = useRef<{ submit: () => Promise<void> }>(null);

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? `Edit ${entityName}`
      : mode === "view"
      ? `View ${entityName}`
      : `Create New ${entityName}`);

  const resolvedDescription =
    description ??
    (mode === "edit"
      ? `Update ${entityName} details.`
      : mode === "view"
      ? `View ${entityName} details.`
      : `Fill in details to create new ${entityName}.`);

  return (
    <DialogTemplate2
      open={open}
      onClose={onClose}
      title={resolvedTitle}
      description={resolvedDescription}
      disableOutsideClose
      iconType={mode}
      className={maxWidth}
      onApply={() => formRef.current?.submit()}
    >
      <EntityForm
        ref={formRef}
        fields={fields}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        mode={mode}
        onCancel={onClose}
        cancelLabel="Cancel"
        showFooter
      />
    </DialogTemplate2>
  );
}
