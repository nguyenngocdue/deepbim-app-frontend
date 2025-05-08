import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { TableContent } from "@/components/model-table/TableContent"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityForm } from "@/components/bim-viewer/common/EntityForm"
import { createProjects, getProjects } from "@/apis/project"
import { Skeleton } from "@/components/ui/skeleton"

interface Project {
  id: number
  type: string
  name: string
  number: string
  access: string
  account: string
  created: string
}

export default function ProjectListPage() {
  const [filter, setFilter] = useState("")
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<Project[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (err) {
        console.error("Failed to fetch projects:", err)
      }
    }
    fetchData()
  }, [])

  const data = useMemo(() => {
    if (!projects) return []
    return projects.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.number.toLowerCase().includes(filter.toLowerCase())
    )
  }, [filter, projects])

  const columns = useMemo<ColumnDef<Project>[]>(() => [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "creator",
      header: "Creator",
      cell: ({ getValue }) => {
        const val = getValue() as any;
        return val?.user_name ?? val?.name ?? val?.label ?? val?.title ?? "-";
      }
    },
    {
      accessorKey: "main_discipline",
      header: "Discipline",
      cell: ({ getValue }) => {
        const val = getValue() as any;
        return val?.name ?? "-";
      }
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "start_time",
      header: "Start Time",
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? new Date(val).toLocaleDateString() : "-";
      }
    },
    {
      accessorKey: "end_time",
      header: "End Time",
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? new Date(val).toLocaleDateString() : "-";
      }
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? new Date(val).toLocaleString() : "-";
      }
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? new Date(val).toLocaleString() : "-";
      }
    },
  ], [])
  

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const projectFields = [
    { name: "name", label: "Project name", placeholder: "Enter project name", type: "text" },
    { name: "description", label: "Description", placeholder: "Enter project description", type: "textarea" },
    { name: "partner", label: "Partner", placeholder: "Enter partner name", type: "text" },
    { name: "main_discipline", label: "Main Discipline", placeholder: "E.g. Structure, Architecture...", type: "text" },
    { name: "location", label: "Location", placeholder: "Enter project location", type: "text" },
    { name: "start_time", label: "Start Time", placeholder: "Select start date", type: "date" },
    { name: "end_time", label: "End Time", placeholder: "Select end date", type: "date" }
  ]

  const handleApply = async (data: any) => {
    await createProjects(data)
    setOpen(false)
  }

  const handleCancel = () => setOpen(false)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Projects</h1>
      <p className="text-muted-foreground mb-6">Manage your current and upcoming projects.</p>

      <Tabs defaultValue="projects" className="mb-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between mb-4">
        <DialogTemplate
          open={open}
          onClose={handleCancel}
          title="Create New Project"
          description="Enter details to create a new project."
          disableOutsideClose
          className="max-w-5xl"
        >
          <EntityForm
            fields={projectFields}
            onSubmit={handleApply}
            submitLabel="Apply"
            cancelLabel="Cancel"
            showFooter
            onCancel={handleCancel}
          />
        </DialogTemplate>

        <div className="flex gap-2 items-center justify-between">
          <Button onClick={() => setOpen(true)}>+ Create Project</Button>
          <div className="flex gap-2">
            <Input
              placeholder="Search projects by name or number..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-72"
            />
            <Button variant="outline">🔍</Button>
          </div>
        </div>
      </div>

      {projects === null ? (
        <Skeleton className="w-full h-40 rounded-md" />
      ) : (
        <TableContent table={table} />
      )}

      <div className="flex justify-between items-center px-4 py-2 text-sm text-muted-foreground">
        <div>Showing {data.length} of {projects?.length ?? 0}</div>
        <div className="flex gap-2">
          <Button variant="ghost">«</Button>
          <div>1 of 1</div>
          <Button variant="ghost">»</Button>
        </div>
      </div>
    </div>
  )
}
