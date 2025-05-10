'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreatePermissionForm } from './CreatePermissionForm'
import { createPermissions, deletePermissions, getPermissions } from '@/apis/permissions/permissions'
import { toast } from 'sonner'

interface Permission {
  id: number
  code: string
  description?: string
}

export function PermissionManagement() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [openCreate, setOpenCreate] = useState(false)

  useEffect(() => {
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    const res = await getPermissions();
    if (res?.data) setPermissions(res.data)
  }

  const handleCreate = async (data: { code: string; description?: string }) => {
    const res = await createPermissions(data)
    if (res?.data) {
      setPermissions((prev) => [...prev, res.data])
      setOpenCreate(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this permission?')
    if (!confirmed) return
    const res = await deletePermissions(id)
    if (res?.statusCode === 200) {
      setPermissions((prev) => prev.filter((p) => p.id !== id))
      toast.success('Permission deleted successfully')
    } else {
      toast.error('Failed to delete permission')
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Permissions</h2>
          <p className="text-sm text-muted-foreground">View, create, or edit system-wide permissions.</p>
        </div>
        <Button onClick={() => setOpenCreate(true)}>Create Permission</Button>
      </div>

      <div className="border rounded-md divide-y bg-muted">
        {permissions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-muted-foreground italic">
            No permissions found.
          </div>
        ) : (
          permissions.map((perm) => (
            <div
              key={perm.id}
              className="flex justify-between items-center px-4 py-3 hover:bg-muted/50"
            >
              <div className="text-sm">
                <div className="font-medium text-foreground">{perm.code}</div>
                <div className="text-xs text-muted-foreground">{perm.description}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(perm.id)}
              >
                🗑
              </Button>
            </div>
          ))
        )}
      </div>

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Permission</DialogTitle>
          </DialogHeader>
          <CreatePermissionForm onCreate={handleCreate} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
