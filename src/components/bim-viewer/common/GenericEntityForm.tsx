import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function GenericEntityForm({
  title,
  fields,
  mode = "create",
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel = "Cancel"
}) {
  const { register, handleSubmit, setValue, reset } = useForm({ defaultValues: initialValues })
  const [dateState, setDateState] = useState({})

  const handleFormSubmit = (data) => {
    onSubmit?.(data)
    reset()
  }

  const isReadOnly = mode === "view" || mode === "delete"

  const renderTitle = () => {
    switch (mode) {
      case "create": return `Create ${title}`
      case "update": return `Update ${title}`
      case "view": return `View ${title}`
      case "delete": return `Delete ${title}`
      default: return title
    }
  }

  return (
    <Card className="bg-background text-foreground border-border">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-left">{renderTitle()}</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-left">
          {fields.map((field, index) => {
            const value = initialValues[field.name] ?? ""

            if (isReadOnly) {
              return (
                <div key={index}>
                  <Label className="text-muted-foreground">{field.label}</Label>
                  <div className="font-medium mt-1">
                    {field.type === "checkbox" ? (value ? "✓ Yes" : "✗ No") : value || "—"}
                  </div>
                </div>
              )
            }

            if (field.type === "text") {
              return (
                <div key={index}>
                  <Label>{field.label}</Label>
                  <Input placeholder={field.placeholder} {...register(field.name)} className="mt-1" />
                </div>
              )
            }
            if (field.type === "textarea") {
              return (
                <div key={index}>
                  <Label>{field.label}</Label>
                  <Textarea placeholder={field.placeholder} {...register(field.name)} className="mt-1" />
                </div>
              )
            }
            if (field.type === "select") {
              return (
                <div key={index}>
                  <Label>{field.label}</Label>
                  <Select onValueChange={(val) => setValue(field.name, val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option, i) => (
                        <SelectItem key={i} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            }
            if (field.type === "checkbox") {
              return (
                <label key={index} className="flex items-center gap-2">
                  <input type="checkbox" {...register(field.name)} />
                  {field.label}
                </label>
              )
            }
            if (field.type === "date") {
              return (
                <div key={index} className="grid gap-1">
                  <Label>{field.label}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateState[field.name] && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateState[field.name]
                          ? format(dateState[field.name], "PPP")
                          : field.placeholder || "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateState[field.name]}
                        onSelect={(date) => {
                          setDateState((prev) => ({ ...prev, [field.name]: date }))
                          setValue(field.name, date)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )
            }

            return null
          })}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        {onCancel && (
          <Button variant="outline" type="button" onClick={onCancel}>{cancelLabel}</Button>
        )}
        {mode !== "view" && (
          <Button type="submit" form={undefined} onClick={handleSubmit(handleFormSubmit)}>
            {submitLabel || (mode === "create" ? "Create" : mode === "update" ? "Save" : mode === "delete" ? "Confirm Delete" : "Submit")}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}