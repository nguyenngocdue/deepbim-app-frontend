import { Checkbox } from "@/components/ui/checkbox"

export function RolePermissionCheckboxes({
  permissions,
  assignedPermissionIds,
  onToggle
}: {
  permissions: { id: number; code: string; description?: string }[]
  assignedPermissionIds: number[]
  onToggle: (permissionId: number) => void
}) {
  return (
    <div className="space-y-2">
      {permissions.map((p) => (
        <div key={p.id} className="flex items-start gap-2">
          <Checkbox
            id={`perm-${p.id}`}
            checked={assignedPermissionIds.includes(p.id)}
            onCheckedChange={() => onToggle(p.id)}
          />
          <label htmlFor={`perm-${p.id}`} className="text-sm leading-5">
            <strong>{p.code}</strong>
            {p.description && (
              <p className="text-xs text-muted-foreground">{p.description}</p>
            )}
          </label>
        </div>
      ))}
    </div>
  )
}
