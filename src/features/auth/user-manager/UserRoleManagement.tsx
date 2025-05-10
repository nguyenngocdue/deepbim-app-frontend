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
    fontSize: '0.875rem',
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
    fontSize: '0.875rem',
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: 'hsl(var(--primary)/15%)',
    borderRadius: '0.25rem',
    padding: '0 4px',
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: 'hsl(var(--primary))',
    fontSize: '0.75rem',
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
      cell: ({ row }) => <div className="font-medium text-foreground">{row.original.user.name}</div>,
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
        <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded bg-primary/10 text-primary">
          {row.original.role.name}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: useMemo(() => userRoles, [userRoles]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-xl font-bold">User Role Management</div>

      <div className="grid md:grid-cols-[1fr_2fr_auto] gap-4 items-end bg-muted/30 p-4 rounded-xl">
        <div>
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
          />
        </div>
        <div>
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
          />
        </div>
        <Button
          onClick={handleAssign}
          disabled={loading || !selectedUserId || selectedRoles.length === 0}
          className="h-10 mt-6"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assign'}
        </Button>
      </div>

      {userRoles.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No user-role assignments found.</p>
      ) : (
        <div className="rounded-lg border">
          <TableContent key={userRoles.length} table={table} />
        </div>
      )}
    </div>
  )
}
