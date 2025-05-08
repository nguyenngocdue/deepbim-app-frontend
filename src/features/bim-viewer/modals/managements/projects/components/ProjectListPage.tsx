// components/ProjectListPage.tsx
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { TableContent } from "@/components/model-table/TableContent"
import { GenericEntityForm } from "@/components/bim-viewer/common/GenericEntityForm"

interface Project {
  id: number
  type: string
  name: string
  number: string
  access: string
  account: string
  created: string
}

const mockData: Project[] = [
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

export default function ProjectListPage() {
  const [filter, setFilter] = useState("")

  const data = useMemo(() =>
    mockData.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.number.toLowerCase().includes(filter.toLowerCase())
    ), [filter]
  )

  const columns = useMemo<ColumnDef<Project>[]>(() => [
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

  const fields = [
    { name: "name", label: "Project name", placeholder: "Enter a project name", type: "text" },
    { name: "number", label: "Project number", placeholder: "Enter a project number", type: "text" },
    {
      name: "account", label: "Account", placeholder: "Select an account", type: "select",
      options: ["Công ty Cổ phần Tập Đoàn Đèo Cả", "Công ty Hạ tầng Miền Tây"]
    },
    {
      name: "access", label: "Project type", placeholder: "Select type", type: "select",
      options: ["Docs", "BIM 360"]
    },
    { name: "address", label: "Address", placeholder: "Enter a location", type: "text" },
    { name: "timezone", label: "Time zone", placeholder: "(GMT+07:00) Bangkok/Hanoi", type: "text" },
    { name: "start_date", label: "Start date", placeholder: "MM/DD/YYYY", type: "text" },
    { name: "end_date", label: "End date", placeholder: "MM/DD/YYYY", type: "text" },
    { name: "value", label: "Project value", placeholder: "Enter value", type: "text" }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Welcome, kha</h1>
      <p className="text-muted-foreground mb-6">What would you like to do today?</p>

      <Tabs defaultValue="projects" className="mb-4">
        <TabsList>
          <TabsTrigger value="home">My Home</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="templates">Project Templates</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Create project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
            </DialogHeader>
            <GenericEntityForm
              title="Project"
              mode="create"
              fields={fields}
              onSubmit={(data) => console.log("Created", data)}
              onCancel={() => console.log("Canceled")}
            />
          </DialogContent>
        </Dialog>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search projects by name or number..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-72"
          />
          <Button variant="outline">🔍</Button>
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