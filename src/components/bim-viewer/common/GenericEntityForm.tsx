import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"

export function GenericEntityForm({
  title,
  fields,
  mode = "create", // "view" | "create" | "update" | "delete"
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel = "Hủy"
}) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initialValues })

  const handleFormSubmit = (data) => {
    onSubmit?.(data)
    reset()
  }

  const isReadOnly = mode === "view" || mode === "delete"

  const renderTitle = () => {
    switch (mode) {
      case "create": return `Tạo ${title}`
      case "update": return `Cập nhật ${title}`
      case "view": return `Chi tiết ${title}`
      case "delete": return `Xóa ${title}`
      default: return title
    }
  }

  return (
    <Card>
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
                    {field.type === "checkbox" ? (value ? "✓ Có" : "✗ Không") : value || "—"}
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
                  <Select {...register(field.name)}>
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
            {submitLabel || (mode === "create" ? "Tạo" : mode === "update" ? "Lưu" : mode === "delete" ? "Xác nhận xóa" : "Gửi")}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
