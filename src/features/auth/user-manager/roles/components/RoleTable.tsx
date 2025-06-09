'use client'

import { ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { TableContent } from '@/components/model-table/TableContent'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { isAdmin } from '@/utils/user'
import { RootState } from '@/store'

interface Role {
  id: number
  name: string
  description?: string
}

interface RoleTableProps {
  roles: Role[]
  onEdit?: (role: Role) => void
  onDelete?: (role: Role) => void
}

export function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isUserAdmin = isAdmin(currentUser);



  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'id',
      header: 'Id',
      meta: { inputType: 'id' },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { inputType: 'text' },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      meta: { inputType: 'tag' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button disabled={!isUserAdmin} size="sm" variant="outline" onClick={() => onEdit?.(row.original)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button disabled={!isUserAdmin} size="sm" variant="destructive" onClick={() => onDelete?.(row.original)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: useMemo(() => roles, [roles]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

 return <TableContent key={roles.length} table={table} />
}
