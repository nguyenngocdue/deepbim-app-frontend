import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { getRoles } from '@/apis/roles/roles'
import { getPermissions, updatePermissions } from '@/apis/permissions/permissions'
import { toast } from 'sonner'
import { getRolePermissions } from '@/apis/role-permissions-api'

interface Role {
  id: number
  name: string
}

interface Permission {
  id: number
  code: string
  description?: string
}

export function RolePermissionManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [matrix, setMatrix] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [roleRes, permRes] = await Promise.all([getRoles(), getPermissions()])

      if (roleRes?.data) setRoles(roleRes.data)
      if (permRes?.data) setPermissions(permRes.data)

      const matrixRes = await getRolePermissions()
      const currentMatrix: Record<string, boolean> = {}

      for (const role of roleRes?.data || []) {
        for (const perm of permRes?.data || []) {
          const key = `${role.id}-${perm.id}`
          currentMatrix[key] = matrixRes.data.some(
            (rp: { role_id: number; permission_id: number }) =>
              rp.role_id === role.id && rp.permission_id === perm.id
          )
        }
      }
      setMatrix(currentMatrix)
    }

    fetchData()
  }, [])

  const togglePermission = (roleId: number, permId: number) => {
    const key = `${roleId}-${permId}`
    setMatrix((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleApply = async () => {
    setLoading(true)
    try {
      for (const role of roles) {
        const permissionIds = permissions
          .filter((perm) => matrix[`${role.id}-${perm.id}`])
          .map((perm) => perm.id)
        await updatePermissions(role.id, permissionIds)
      }
      toast.success('Permissions updated successfully')
    } catch (error: any) {
      toast.error('Failed to update permissions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-background border rounded-xl shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Role Permission Management</h2>
          <p className="text-sm text-muted-foreground">
            Assign permissions to roles to control access rights.
          </p>
        </div>
        <Button onClick={handleApply} disabled={loading} className="h-9">
          {loading ? 'Applying...' : 'Apply Changes'}
        </Button>
      </div>

      <div className="overflow-auto border rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted text-xs text-muted-foreground uppercase">
            <tr>
              <th className="border px-4 py-2 text-left">Permission</th>
              {roles.map((role) => (
                <th key={role.id} className="border px-4 py-2 text-center">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {permissions.map((perm) => (
              <tr key={perm.id} className="hover:bg-muted/30 transition">
                <td className="px-4 py-2">
                  <div className="font-medium text-foreground">{perm.code}</div>
                  <div className="text-xs text-muted-foreground">{perm.description}</div>
                </td>
                {roles.map((role) => {
                  const key = `${role.id}-${perm.id}`
                  return (
                    <td key={key} className="px-4 py-2 text-center">
                      <Checkbox
                        checked={matrix[key] || false}
                        onCheckedChange={() => togglePermission(role.id, perm.id)}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}