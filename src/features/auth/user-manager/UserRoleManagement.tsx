import { useEffect, useState, useMemo } from 'react'
import { ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import Select from 'react-select'
import { TableContent } from '@/components/model-table/TableContent'
import {
  deleteUserRoles,
  fetchUserRoles,
  getUserRoles,
  getUsers,
} from '@/apis/users/UserSettings'
import { getRoles } from '@/apis/roles/roles'
import { useSelector } from 'react-redux'
import { isAdmin } from '@/utils/user'
import { RootState } from '@/store'

interface User {
  id: number
  name: string
  user_name: string
}
interface Role {
  id: number
  name: string
}
interface UserRole {
  id: number
  user: User
  role: Role
}

const selectStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--border))',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    minHeight: '2.5rem',
    boxShadow: 'none',
    '&:hover': { borderColor: 'hsl(var(--primary))' },
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused
      ? 'hsl(var(--muted))'
      : 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
    fontSize: '0.95rem',
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: 'hsl(var(--primary)/10%)',
    borderRadius: '0.25rem',
    padding: '0 4px',
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: 'hsl(var(--primary))',
    fontSize: '0.82rem',
    fontWeight: '500',
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
}

export function UserRoleManagement() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>()
  const [selectedRoles, setSelectedRoles] = useState<{ label: string; value: number }[]>([])
  const [loading, setLoading] = useState(false)
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isUserAdmin = isAdmin(currentUser);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [urRes, uRes, rRes] = await Promise.all([
        getUserRoles(),
        getUsers(),
        getRoles(),
      ])
      setUserRoles(urRes?.data ?? [])
      setUsers(uRes?.data ?? [])
      setRoles(rRes?.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedUserId || selectedRoles.length === 0) return
    setLoading(true)
    try {
      await Promise.all(
        selectedRoles.map((role) =>
          fetchUserRoles(selectedUserId, [role.value])
        )
      )
      await fetchData()
      setSelectedUserId(undefined)
      setSelectedRoles([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setLoading(true)
    try {
      await deleteUserRoles(id)
      await fetchData()
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnDef<UserRole>[] = [
    {
      accessorKey: 'user.name',
      header: 'User',
      cell: ({ row }) => <div className="font-medium">{row.original.user.name}</div>,
    },
    {
      accessorKey: 'user.user_name',
      header: 'Username',
      cell: ({ row }) => <span className="text-muted-foreground">@{row.original.user.user_name}</span>,
    },
    {
      accessorKey: 'role.name',
      header: 'Role',
      cell: ({ row }) => (
        <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-md bg-primary/10 text-primary">
          {row.original.role.name}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => handleDelete(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: useMemo(() => userRoles, [userRoles]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full p-0 md:p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            User Role Management
          </h2>
          <span className="text-xs text-muted-foreground">Assign roles for each user easily below.</span>
        </div>
      </div>

      {/* Form: Assign Role */}
      {
        isUserAdmin && <>
            <div className="w-full bg-muted/60 rounded-md p-4 flex flex-col md:flex-row gap-3 items-end md:items-center">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-medium mb-1 text-muted-foreground">User</label>
                <Select
                  options={users.map((u) => ({ label: u.user_name, value: u.id }))}
                  value={
                    selectedUserId
                      ? { label: users.find((u) => u.id === selectedUserId)?.user_name || '', value: selectedUserId }
                      : null
                  }
                  onChange={(opt) => setSelectedUserId(opt?.value)}
                  placeholder="Select user..."
                  styles={selectStyles}
                  menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                  isDisabled={loading}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Roles</label>
                <Select
                  isMulti
                  options={roles.map((role) => ({ label: role.name, value: role.id }))}
                  value={selectedRoles}
                  onChange={(selected) => setSelectedRoles(selected as { label: string; value: number }[])}
                  placeholder="Select roles..."
                  styles={selectStyles}
                  menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                  isDisabled={loading}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <Button
                onClick={handleAssign}
                disabled={loading || !selectedUserId || selectedRoles.length === 0}
                className="h-10 min-w-[90px] md:mt-6"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assign'}
              </Button>
            </div>

            {/* Table */}
            <div className="w-full">
              {userRoles.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground italic">
                  No user-role assignments found.
                </div>
              ) : (
                <div className="rounded-md border bg-background overflow-x-auto">
                  <TableContent key={userRoles.length} table={table} />
                </div>
              )}
            </div>
        </>
      }
    </div>
  )
}
