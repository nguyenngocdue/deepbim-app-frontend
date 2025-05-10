'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CreatePermissionFormProps {
  onCreate: (data: { code: string; description?: string }) => void
}

export function CreatePermissionForm({ onCreate }: CreatePermissionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = (data: any) => {
    onCreate(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          placeholder="e.g. project:create"
          {...register('code', { required: 'Code is required' })}
        />
        {errors.code && <p className="text-sm text-red-500 mt-1">{(errors.code as any).message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Short description of the permission"
          {...register('description')}
        />
      </div>

      <div className="pt-2 text-right">
        <Button type="submit">Create</Button>
      </div>
    </form>
  )
}
