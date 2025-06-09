import { useEffect, useState } from 'react'
import { UserTable } from './components/UserTable'
import { AssignRoleModal } from './components/AssignRoleModal'
import { Role, User } from './components/Type'
import { fetchUserRoles, getUsers, createNewUser } from '@/apis/users/UserSettings'
import { getRoles } from '@/apis/roles/roles'
import { Button } from '@/components/ui/button'
import { CreateUserModal } from '@/components/bim-viewer/common/CreateUserModal'
import { CLASS_NAME_DEFAULT } from '@/utils/class'
import { SearchBox } from '@/components/SearchBox'
import { useSelector } from 'react-redux'
import { isAdmin } from '@/utils/user'
import { RootState } from '@/store'

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [openCreateUser, setOpenCreateUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const isUserAdmin = isAdmin(currentUser);

  useEffect(() => {
    fetchData()
  }, [])

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

  const handleAssignRoles = async (userId: number, roleIds: number[]) => {
    try {
      await fetchUserRoles(userId, roleIds)
      await fetchData()
    } catch (err) {
      console.error('Failed to assign roles:', err)
    } finally {
      setSelectedUser(null)
    }
  }

  const handleCreateUser = async (data: { user_name: string; email: string; password: string }) => {
    try {
      await createNewUser(data)
      await fetchData()
    } catch (error: any) {
      throw error
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )


  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading users and roles...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground mb-1">User Management</h2>
        <div className="flex gap-2 w-full sm:w-auto sm:flex-row flex-col">
          <div className="w-full sm:w-64">
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search users..."
            />
          </div>
          {
            isUserAdmin && 
            <Button
              className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`}
              onClick={() => setOpenCreateUser(true)}
            >
              + Create User
            </Button>
          }
        </div>
      </div>

      <UserTable users={filteredUsers} onAssignRole={setSelectedUser} />

      {selectedUser && (
        <AssignRoleModal
          user={selectedUser}
          roles={roles}
          onClose={() => setSelectedUser(null)}
          onSave={handleAssignRoles}
        />
      )}

      <CreateUserModal
        open={openCreateUser}
        onClose={() => setOpenCreateUser(false)}
        onSave={handleCreateUser}
      />
    </div>
  )
}
