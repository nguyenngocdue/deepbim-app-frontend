import { useState } from 'react'
import { Role, User } from './Type'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { DialogTemplate } from '@/components/model-table/DialogTemplate'

export function AssignRoleModal({
  user,
  roles,
  onClose,
  onSave
}: {
  user: User
  roles: Role[]
  onClose: () => void
  onSave: (userId: number, roleIds: number[]) => void
}) {
  const [selected, setSelected] = useState<number[]>(
    (user.roles ?? []).map((r) => r.id)
  )

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  return (
    <DialogTemplate
      open={true}
      onClose={onClose}
      title={`Assign Roles to ${user.email}`}
      description="Select one or more roles for this user"
      disableOutsideClose
      onApply={() => onSave(user.id, selected)}
      onApplyText='Apply'
    
    >
      <div className="rounded-md max-h-64 overflow-y-auto border border-border divide-y">
        {roles.map((role) => {
          const isChecked = selected.includes(role.id)
          return (
            <div
              key={role.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-1 sm:gap-4 transition-colors ${
                isChecked ? 'bg-muted/90' : 'hover:bg-muted/90'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={isChecked}
                  onCheckedChange={() => toggle(role.id)}
                />
                <label
                  htmlFor={`role-${role.id}`}
                  className="cursor-pointer text-sm font-medium leading-5"
                >
                  {role.name}
                </label>
              </div>
              {role.description && (
                <p className="text-xs text-muted-foreground sm:text-right sm:max-w-[60%]">
                  {role.description}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </DialogTemplate>
  )
}
