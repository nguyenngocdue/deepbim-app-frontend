import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { getRoles } from '@/apis/roles/roles'
import { getPermissions, updatePermissions } from '@/apis/permissions/permissions'
import { toast } from 'sonner'
import { getRolePermissions } from '@/apis/role-permissions-api'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { isAdmin } from '@/utils/user'

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
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isUserAdmin = isAdmin(currentUser);

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
    <div className="w-full p-0 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Role Permission Management
          </h2>
          <p className="text-xs text-muted-foreground">
            Assign permissions to each role to control access.
          </p>
        </div>
        <Button onClick={handleApply} disabled={loading} className="h-9 w-fit">
          {loading ? 'Applying...' : 'Apply Changes'}
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-md border bg-background">
        <table className="w-full border-collapse text-sm min-w-[520px]">
          <thead>
            <tr className="bg-muted/60">
              <th className="px-4 py-2 text-left font-medium text-xs text-muted-foreground border-b border-border">
                Permission
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className="px-4 py-2 text-center font-medium text-xs text-muted-foreground border-b border-border"
                >
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr
                key={perm.id}
                className="border-b border-border hover:bg-muted/30 transition"
              >
                <td className="px-4 py-2">
                  <div className="font-medium text-foreground">{perm.code}</div>
                  <div className="text-xs text-muted-foreground">{perm.description}</div>
                </td>
                {roles.map((role) => {
                  const key = `${role.id}-${perm.id}`
                  return (
                    <td key={key} className="px-4 py-2 text-center">
                     <Checkbox
                          disabled={!isUserAdmin}
                          checked={ matrix[key] || false}
                          onCheckedChange={() => togglePermission(role.id, perm.id)}
                          className="mx-auto border-border text-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
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
