'use client'

import { EntityForm } from "@/components/bim-viewer/common/EntityForm";


export function CreateRoleForm({
  onCreate,
}: {
  onCreate: (data: { name: string; description?: string }) => void
}) {
  const fields = [
    {
      name: 'name',
      label: 'Role Name',
      placeholder: 'e.g. admin, editor...',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Description',
      placeholder: 'Describe what this role can do...',
      type: 'textarea',
    },
  ]

  return (
    <EntityForm
      fields={fields}
      onSubmit={onCreate}
      showFooter
      submitLabel="Create Role"
    />
  )
}
