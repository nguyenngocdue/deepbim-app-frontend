import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
                    <Select value={value ?? ""} onValueChange={onChange}>
                      <SelectTrigger
                        className={cn("mt-1", errors[field.name] && "border-red-500")}
                      >
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt, i) =>
                          typeof opt === "string" ? (
                            <SelectItem key={i} value={opt}>
                              {opt}
                            </SelectItem>
                          ) : (
                            <SelectItem key={i} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          )
                        )}
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
                    <div>
                      <LabelWithRequired label={field.label} required={field.required} />
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm font-normal cursor-pointer",
                              !dateValue && "text-muted-foreground",
                              errors[field.name] && "border-red-500"
                            )}
                          >
                            {dateValue
                              ? format(dateValue, "PPP")
                              : field.placeholder || "Pick a date"}
                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0 w-auto">
                          <Calendar
                            mode="single"
                            selected={dateValue || undefined}
                            onSelect={(date) => {
                              onChange(date);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
