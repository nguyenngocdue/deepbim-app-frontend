import { useEffect, useState } from 'react'
import { UserTable } from './components/UserTable'
import { AssignRoleModal } from './components/AssignRoleModal'
import { Role, User } from './components/Type'
import { fetchUserRoles, getUsers } from '@/apis/users/UserSettings'
import { getRoles } from '@/apis/roles/roles'

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, roleRes] = await Promise.all([getUsers(), getRoles()])
        if (userRes?.data) setUsers(userRes.data)
        if (roleRes?.data) setRoles(roleRes.data)
      } catch (err) {
        console.error('Failed to fetch users or roles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAssignRoles = async (userId: number, roleIds: number[]) => {
    try {
      await fetchUserRoles(userId, roleIds)
      const updated = await getUsers()
      if (updated?.data) setUsers(updated.data)
    } catch (err) {
      console.error('Failed to assign roles:', err)
    } finally {
      setSelectedUser(null)
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading users and roles...</div>
  }

  return (
    <div className="space-y-4">
      <UserTable users={users} onAssignRole={setSelectedUser} />
      {selectedUser && (
        <AssignRoleModal
          user={selectedUser}
          roles={roles}
          onClose={() => setSelectedUser(null)}
          onSave={handleAssignRoles}
        />
      )}
    </div>
  )
}
