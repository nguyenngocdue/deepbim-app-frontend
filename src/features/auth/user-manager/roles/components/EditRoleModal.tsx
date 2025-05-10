// EditRoleModal.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EntityForm } from '@/components/bim-viewer/common/EntityForm'
import { Role } from '../../users/components/Type'

interface EditRoleModalProps {
  open: boolean
  onClose: () => void
  role: Role | null
  onUpdate: (updated: { name: string; description?: string }) => void
}

export function EditRoleModal({ open, onClose, role, onUpdate }: EditRoleModalProps) {
  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role: {role.name}</DialogTitle>
        </DialogHeader>
        <EntityForm
          fields={[
            { name: 'id', label: 'Id', type: 'id' },
            { name: 'name', label: 'Role Name', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
          ]}
          defaultValues={{ id: role.id, name: role.name, description: role.description || '' }}
          onSubmit={onUpdate}
          showFooter
          submitLabel="Update Role"
        />
      </DialogContent>
    </Dialog>
  )
}
