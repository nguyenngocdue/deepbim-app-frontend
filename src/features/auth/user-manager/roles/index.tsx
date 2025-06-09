'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createRoles, deleteRole, getRoles, updateRole } from '@/apis/roles/roles'
import { CreateRoleForm } from './components/CreateRoleForm'
import { RoleTable } from './components/RoleTable'
import { EditRoleModal } from './components/EditRoleModal'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { useSelector } from 'react-redux'
import { isAdmin } from '@/utils/user'
import { RootState } from '@/store'

interface Role {
  id: number
  name: string
  description?: string
}

export function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [openCreate, setOpenCreate] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isUserAdmin = isAdmin(currentUser);

  useEffect(() => {
    getRoles().then(res => {
      if (res?.data) setRoles(res.data)
    })
  }, [])

  const handleCreate = async (data: { name: string; description?: string }) => {
    const res = await createRoles(data)
    if (res?.data) {
      setRoles(prev => [...prev, res.data])
      setOpenCreate(false)
    }
  }

  const handleUpdate = async (updated: { name: string; description?: string }) => {
    if (!editingRole) return
    const res = await updateRole(editingRole.id, updated)
    if (res?.data) {
      setRoles(prev => prev.map(r => (r.id === editingRole.id ? { ...r, ...res.data } : r)))
      setOpenEdit(false)
      setEditingRole(null)
    }
  }

  const confirmDelete = async () => {
    if (!deletingRole) return
    const res = await deleteRole(deletingRole.id);
    if (res.ok) {
      const updated = await getRoles()
      setRoles(updated.data || [])
      toast.success('Role deleted successfully')
    } else {
      toast.error('Failed to delete role')
    }
    setDeletingRole(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground mb-1">Role Management</h2>
        {isUserAdmin
          &&
          <Button onClick={() => setOpenCreate(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        }
      </div>


      <RoleTable
        key={roles.length}
        roles={roles}
        onEdit={(role) => {
          setEditingRole(role)
          setOpenEdit(true)
        }}
        onDelete={(role) => setDeletingRole(role)}
      />

      {
        isUserAdmin && <>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <CreateRoleForm onCreate={handleCreate} />
            </DialogContent>
          </Dialog>
          <EditRoleModal
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            role={editingRole}
            onUpdate={handleUpdate}
          />
          <AlertDialog open={!!deletingRole} onOpenChange={() => setDeletingRole(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete role{' '}
                  <strong>{deletingRole?.name}</strong>? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      }
    </div>
  )
}
