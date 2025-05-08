// EntityForm.tsx
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Field {
  name: string
  label: string
  placeholder?: string
  type: "text" | "textarea" | "select" | "date"
  options?: string[]
}

interface EntityFormProps {
  fields: Field[]
  onSubmit: (data: any) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  showFooter?: boolean
}

export function EntityForm({
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  showFooter = false
}: EntityFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm()
  const [dateState, setDateState] = useState<Record<string, Date | null>>({})

  const handleFormSubmit = (data: any) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-left">
      {fields.map((field, index) => {
        if (field.type === "text") {
          return (
            <div key={index}>
              <Label title={field.name}>{field.label}</Label>
              <Input
                placeholder={field.placeholder}
                {...register(field.name, {
                  required: `${field.label} is required`
                })}
                className={cn("mt-1", errors[field.name] && "border-red-500")}
              />
              {errors[field.name] && (
                <p className="text-sm text-red-500 mt-1">{(errors[field.name] as any).message}</p>
              )}
            </div>
          )
        }

        if (field.type === "textarea") {
          return (
            <div key={index}>
              <Label title={field.name}>{field.label}</Label>
              <Textarea
                placeholder={field.placeholder}
                {...register(field.name)}
                className={cn("mt-1", errors[field.name] && "border-red-500")}
              />
              {errors[field.name] && (
                <p className="text-sm text-red-500 mt-1">{(errors[field.name] as any).message}</p>
              )}
            </div>
          )
        }

        if (field.type === "select") {
          return (
            <div key={index}>
              <Label title={field.name}>{field.label}</Label>
              <Select onValueChange={(val) => setValue(field.name, val, { shouldValidate: true })}>
                <SelectTrigger className={cn("mt-1", errors[field.name] && "border-red-500")}> 
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option, i) => (
                    <SelectItem key={i} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[field.name] && (
                <p className="text-sm text-red-500 mt-1">{(errors[field.name] as any).message}</p>
              )}
            </div>
          )
        }

        if (field.type === "date") {
          return (
            <div key={index}>
              <Label title={field.name}>{field.label}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    className={cn(
                      "w-full flex items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm font-normal cursor-pointer",
                      !dateState[field.name] && "text-muted-foreground",
                      errors[field.name] && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateState[field.name]
                      ? format(dateState[field.name]!, "PPP")
                      : field.placeholder || "Pick a date"}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateState[field.name] || undefined}
                    onSelect={(date) => {
                      setDateState((prev) => ({ ...prev, [field.name]: date }))
                      setValue(field.name, date, { shouldValidate: true })
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors[field.name] && (
                <p className="text-sm text-red-500 mt-1">{(errors[field.name] as any).message}</p>
              )}
            </div>
          )
        }

        return null
      })}

      {showFooter && (
        <div className="pt-6 flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      )}
    </form>
  )
}