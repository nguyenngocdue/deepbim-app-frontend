// SubProjectListPage.tsx
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { TableContent } from "@/components/model-table/TableContent"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityForm } from "@/components/bim-viewer/common/EntityForm"
import AppButton from "@/components/bim-viewer/common/AppButton"

interface SubProject {
  id: number
  type: string
  name: string
  number: string
  access: string
  account: string
  created: string
}

const mockData: SubProject[] = [
  {
    id: 1,
    type: "🌐",
    name: "HCM-TL-MT_FS",
    number: "HCM-TL-MT_25",
    access: "Docs",
    account: "Công ty Cổ phần Tập Đoàn Đèo Cả",
    created: "25 thg 2, 2025"
  },
  {
    id: 2,
    type: "🏗️",
    name: "CANTHO-EXP_2",
    number: "CTH-EXP-122",
    access: "BIM 360",
    account: "Công ty Hạ tầng Miền Tây",
    created: "10 thg 3, 2025"
  },
  {
    id: 3,
    type: "🛰️",
    name: "HA-NOI-INFRA",
    number: "HN-INF-88",
    access: "Docs",
    account: "Tổng công ty Hạ tầng Đô thị",
    created: "5 thg 1, 2025"
  }
]

export default function SubProjectListPage() {
  const [filter, setFilter] = useState("")
  const [open, setOpen] = useState(false)

  const data = useMemo(() =>
    mockData.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.number.toLowerCase().includes(filter.toLowerCase())
    ), [filter]
  )

  const columns = useMemo<ColumnDef<SubProject>[]>(() => [
    { accessorKey: "type", header: "Type" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "number", header: "Number" },
    { accessorKey: "access", header: "Default access" },
    { accessorKey: "account", header: "Account" },
    { accessorKey: "created", header: "Created on" }
  ], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const subProjectFields = [
    { name: "name", label: "Sub-project name", placeholder: "Enter sub-project name", type: "text" },
    { name: "description", label: "Description", placeholder: "Enter description", type: "textarea" },
    { name: "partner", label: "Partner", placeholder: "Enter partner", type: "text" },
    { name: "main_discipline", label: "Discipline", placeholder: "E.g. Architecture, Structure...", type: "text" },
    { name: "location", label: "Location", placeholder: "Enter location", type: "text" },
    { name: "start_time", label: "Start Time", placeholder: "Pick start date", type: "date" },
    { name: "end_time", label: "End Time", placeholder: "Pick end date", type: "date" }
  ]

  const handleApply = (data: any) => {
    console.log("Submitted sub-project:", data)
    setOpen(false)
  }

  const handleCancel = () => setOpen(false)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Sub-Projects</h1>
      <p className="text-muted-foreground mb-6">Manage your current and upcoming sub-projects.</p>

      <Tabs defaultValue="subprojects" className="mb-4">
        <TabsList>
          <TabsTrigger value="subprojects">Sub-Projects</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between mb-4">
        <DialogTemplate
          open={open}
          onClose={handleCancel}
          title="Create New Sub-Project"
          description="Fill in the details to create a new sub-project."
          disableOutsideClose
          className="max-w-5xl"
        >
          <EntityForm
            fields={subProjectFields}
            onSubmit={handleApply}
            submitLabel="Apply"
            cancelLabel="Cancel"
            showFooter
            onCancel={handleCancel}
          />
        </DialogTemplate>

        <div className="flex gap-2 items-center justify-between">
          <Button onClick={() => setOpen(true)}>+ Create Sub-Project</Button>
          <div className="flex gap-2">
            <Input
              placeholder="Search sub-projects..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-72"
            />
            <Button variant="outline">🔍</Button>
          </div>
        </div>
      </div>

      <TableContent table={table} />

      <div className="flex justify-between items-center px-4 py-2 text-sm text-muted-foreground">
        <div>Showing {data.length} of {mockData.length}</div>
        <div className="flex gap-2">
          <Button variant="ghost">«</Button>
          <div>1 of 1</div>
          <Button variant="ghost">»</Button>
        </div>
      </div>
    </div>
  )
}