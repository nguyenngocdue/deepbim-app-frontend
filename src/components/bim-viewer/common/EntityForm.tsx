import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import {
  Input,
} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DatePicker from "react-datepicker";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

interface Field {
  name: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "select" | "date" | "readonly" | "id";
  options?: (string | { label: string; value: string })[];
  required?: boolean;
}

interface EntityFormProps {
  fields: Field[];
  onSubmit?: (data: any) => void;
  defaultValues?: Record<string, any>;
  mode?: "create" | "edit" | "view";  // 3 chế độ
}

export const EntityForm = forwardRef<any, EntityFormProps>(({
  fields,
  onSubmit,
  defaultValues = {},
  mode = "create", // mặc định create
}, ref) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues, mode: "onChange" });

  useImperativeHandle(ref, () => ({
    submit: () => {
      if (onSubmit) {
        handleSubmit(onSubmit)();
      }
    },
  }));

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const LabelWithRequired = ({ label, required }: { label: string; required?: boolean }) => (
    <Label className="font-semibold">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </Label>
  );

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit" || mode === "create";

  return (
    <form
      onSubmit={isEditMode && onSubmit ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
      className="space-y-4 text-left"
    >
      {fields.map((field, index) => {
        if (field.type === "readonly" || field.type === "id") {
          return (
            <div key={index}>
              <LabelWithRequired label={field.label} required={field.required} />
              <div
                className="mt-1 p-2 rounded border dark:bg-gray-100 text-gray-700 select-none"
                title={String(defaultValues[field.name] ?? "")}
              >
                {field.type === "id"
                  ? `#${defaultValues[field.name] ?? ""}`
                  : defaultValues[field.name] ?? ""}
              </div>
            </div>
          );
        }

        if (isViewMode) {
          switch (field.type) {
            case "text":
            case "textarea":
              return (
                <div key={index}>
                  <LabelWithRequired label={field.label} required={field.required} />
                  <div
                    className={cn(
                      "mt-1 p-2 rounded border dark:bg-gray-100 text-gray-700 select-none",
                      field.type === "textarea" && "whitespace-pre-wrap"
                    )}
                    title={String(defaultValues[field.name] ?? "-")}
                  >
                    {defaultValues[field.name] ?? "-"}
                  </div>
                </div>
              );
            case "select": {
              const val = (() => {
                const opt = field.options?.find(o =>
                  typeof o === "string"
                    ? o === defaultValues[field.name]
                    : o.value === defaultValues[field.name]
                );
                return typeof opt === "string" ? opt : opt?.label ?? "-";
              })();
              return (
                <div key={index}>
                  <LabelWithRequired label={field.label} required={field.required} />
                  <div
                    className="mt-1 p-2 rounded border dark:bg-gray-100 text-gray-700 select-none"
                    title={val}
                  >
                    {val}
                  </div>
                </div>
              );
            }
            case "date": {
              const dateVal = defaultValues[field.name]
                ? format(new Date(defaultValues[field.name]), "PPP")
                : "-";
              return (
                <div key={index}>
                  <LabelWithRequired label={field.label} required={field.required} />
                  <div
                    className="mt-1 p-2 rounded border dark:bg-gray-100 text-gray-700 select-none"
                    title={dateVal}
                  >
                    {dateVal}
                  </div>
                </div>
              );
            }
            default:
              return null;
          }
        }

        if (isEditMode) {
          if (field.type === "text") {
            return (
              <div key={index}>
                <LabelWithRequired label={field.label} required={field.required} />
                <Input
                  placeholder={field.placeholder}
                  {...register(field.name, {
                    required: field.required ? `${field.label} is required` : false,
                  })}
                  className={cn("mt-1", errors[field.name] && "border-red-500")}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {(errors[field.name] as any).message}
                  </p>
                )}
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div key={index}>
                <LabelWithRequired label={field.label} required={field.required} />
                <Textarea
                  placeholder={field.placeholder}
                  {...register(field.name, {
                    required: field.required ? `${field.label} is required` : false,
                  })}
                  className={cn("mt-1", errors[field.name] && "border-red-500")}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {(errors[field.name] as any).message}
                  </p>
                )}
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={index}>
                <LabelWithRequired label={field.label} required={field.required} />
                
                
                
<Controller
  control={control}
  name={field.name}
  rules={{
    required: field.required ? `${field.label} is required` : false,
  }}
  render={({ field: { onChange, value } }) => (
    <Select
      value={String(value ?? "")}
      onValueChange={(val) => {
        let parsed: any = val;

        if (field.castType === "boolean") {
          parsed = val === "true"; // "true" → true | "false" → false
        } else if (field.castType === "number") {
          parsed = Number(val); // "1" → 1
        }

        onChange(parsed);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={field.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((opt, i) => {
          const { label, value } = normalizeOption(opt);
          return (
            <SelectItem key={i} value={String(value)}>
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  )}
/>






                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {(errors[field.name] as any).message}
                  </p>
                )}
              </div>
            );
          }

          if (field.type === "date") {
            return (
             

<Controller
  key={index}
  control={control}
  name={field.name}
  rules={{
    required: field.required ? `${field.label} is required` : false,
  }}
  render={({ field: { onChange, value } }) => {
    const dateValue = value ? new Date(value) : null;
    return (
      <div className="flex flex-col gap-2">
        <LabelWithRequired  label={field.label} required={field.required} />
        <DatePicker
          selected={dateValue}
          onChange={(date) => onChange(date)}
          placeholderText={field.placeholder || "Pick a date"}
          className={cn(
            "w-full rounded-md border border-input px-3 py-2 text-sm font-normal bg-background",
            errors[field.name] && "border-red-500"
          )}
          dateFormat="PPP"
        />
        {errors[field.name] && (
          <p className="text-sm text-red-500 mt-1">
            {(errors[field.name] as any).message}
          </p>
        )}
      </div>
    );
  }}
/>
             
            );
          }
        }

        return null;
      })}
    </form>
  );
});



function normalizeOption(opt: string | boolean | { label: string; value: string | boolean }) {
  if (typeof opt === "string") {
    return { label: opt, value: opt };
  }

  if (typeof opt === "boolean") {
    return { label: opt ? "True" : "False", value: String(opt) };
  }

  return opt; // dạng { label, value }
}
