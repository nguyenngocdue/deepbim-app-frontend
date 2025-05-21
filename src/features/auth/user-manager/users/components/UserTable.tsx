import { useMemo } from 'react'
import { User } from './Type'
import { Button } from '@/components/ui/button'
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table'
import { TableContent } from '@/components/model-table/TableContent'
import { Badge, getBadgeVariant } from '@/components/ui/badge'
import { CLASS_NAME_DEFAULT } from '@/utils/class'

export function UserTable({
  users,
  onAssignRole,
}: {
  users: User[]
  onAssignRole: (user: User) => void
}) {
  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    },
    {
      accessorKey: 'userRoles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = row.original.userRoles ?? []
        return roles.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {roles.map((ur) => (
              <Badge
                key={ur.role.id}
                variant={getBadgeVariant(ur.role.name)}
                className="text-xs font-normal"
              >
                {ur.role.name}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic ">No role</span>
        )
      }
    }
    ,    
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_APPLY}`} onClick={() => onAssignRole(row.original)}>
          Assign Role
        </Button>
      ),
    },
  ], [onAssignRole])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <TableContent table={table} showNo />
}
