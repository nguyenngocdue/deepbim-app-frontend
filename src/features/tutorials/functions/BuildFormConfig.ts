// components/common/form/buildFormConfig.ts
import { FormOption } from "@/components/common/types";

interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "select" | "number" | "checkbox";
  required?: boolean;
  options?: FormOption[];
  castType?: "number" | "boolean" | "string";
}

interface BuildFormConfigProps<T> {
  selectedRow: T | null;
  fields: FieldConfig[];
  selectMap?: Record<string, FormOption[]>;
}

export function BuildFormConfig<T>({
  selectedRow,
  fields,
  selectMap = {},
}: BuildFormConfigProps<T>) {
  const defaultValues = selectedRow
    ? fields.reduce((acc, field) => {
        const rawValue = (selectedRow as any)[field.name];

        // For select fields, ensure the value is converted to string/boolean
        if (field.type === "select") {
          const options = selectMap[field.name];
          if (options) {
            const match = options.find((opt) => String(opt.value) === String(rawValue));
            acc[field.name] = match ? match.value : "";
          } else {
            acc[field.name] = rawValue;
          }
        } else {
          acc[field.name] = rawValue;
        }

        return acc;
      }, {} as any)
    : {};

  return {
    formFields: fields,
    defaultValues,
  };
}

export type { FieldConfig };
