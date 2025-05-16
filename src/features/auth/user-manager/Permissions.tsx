'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreatePermissionForm } from './CreatePermissionForm'
import { createPermissions, deletePermissions, getPermissions } from '@/apis/permissions/permissions'
import { toast } from 'sonner'
import { Trash2, ShieldAlert } from 'lucide-react'

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
    try {
      const res = await getPermissions()
      if (res?.data) setPermissions(res.data)
      else toast.error('Failed to fetch permissions')
    } catch {
      toast.error('Error fetching permissions')
    }
  }

  const handleCreate = async (data: { code: string; description?: string }) => {
    try {
      const res = await createPermissions(data)
      if (res?.data) {
        setPermissions((prev) => [...prev, res.data])
        setOpenCreate(false)
        toast.success('Permission created')
      } else toast.error('Failed to create permission')
    } catch {
      toast.error('Error creating permission')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this permission?')) return
    try {
      const res = await deletePermissions(id)
      if (res?.statusCode === 200) {
        setPermissions((prev) => prev.filter((p) => p.id !== id))
        toast.success('Permission deleted')
      } else toast.error('Failed to delete')
    } catch {
      toast.error('Error deleting permission')
    }
  }

  return (
    <div className="space-y-6 p-6 bg-background shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Permissions</h2>
          <p className="text-sm text-muted-foreground">Manage system-wide permissions efficiently.</p>
        </div>
        <Button onClick={() => setOpenCreate(true)}>+ New Permission</Button>
      </div>

      {permissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border rounded-2xl bg-muted/10 shadow-inner">
          <ShieldAlert className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="font-medium text-muted-foreground">No permissions yet</p>
          <Button variant="outline" onClick={() => setOpenCreate(true)} className="mt-4">
            Create First Permission
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 border rounded-md">
          {permissions.map((perm) => (
            <div
              key={perm.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 hover:bg-muted/15 shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <div className="text-base font-semibold text-foreground">{perm.code}</div>
                {perm.description && (
                  <div className="text-sm text-muted-foreground mt-1">{perm.description}</div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/20"
                onClick={() => handleDelete(perm.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Permission</DialogTitle>
          </DialogHeader>
          <CreatePermissionForm onCreate={handleCreate} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
