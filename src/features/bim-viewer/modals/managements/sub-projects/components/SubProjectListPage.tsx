// SubProjectListPage.tsx
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { TableContent } from "@/components/model-table/TableContent"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityForm } from "@/components/bim-viewer/common/EntityForm"
import { createSubProjects, getSubProjects } from "@/apis/sub-project-api"
import { getProjects } from "@/apis/project"
import { LinkId } from "@/components/common/LinkId"

interface SubProject {
  id: number
  name: string
  number?: string
  access?: string
  type?: string
  created_at: string
  discipline?: { name: string }
  owner?: { name: string }
  creator?: { name: string }
}

export default function SubProjectListPage() {
  const [filter, setFilter] = useState("")
  const [data, setData] = useState<SubProject[]>([])
  const [open, setOpen] = useState(false)
  const [projectOptions, setProjectOptions] = useState<string[]>([])

  const fetchProjects = async () => {
    const res = await getProjects();
    const options = res?.data.map((proj: any) => ({
      label: proj.name,
      value: proj.id.toString(),
    }))
    setProjectOptions(options)
  }
  const fetchData = async () => {
    const res = await getSubProjects();
    const formatted = res?.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      project: item.project.name,
      access: item.is_public ? "Public" : item.is_visible ? "Internal" : "Hidden",
      start_time: item.start_time,
      end_time: item.end_time,
      discipline: item.discipline?.name,
      creator: item.creator,
      owner: item.owner,
      created_at: formatDate(item.created_at),
    }))
    setData(formatted);
  }

  useEffect(() => {
    fetchData();
    fetchProjects();
  }, [filter])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }


  const columns = useMemo<ColumnDef<SubProject>[]>(() => [
    { 
      accessorKey: "id", 
      header: "Id",
      cell: ({ row }) => ( <LinkId id={row.original.id} href="/managements/sub-projects" />)
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "project", header: "Project" },
    { accessorKey: "discipline", header: "Discipline" },
    { accessorKey: "start_time", header: "Start Time" },
    { accessorKey: "end_time", header: "End Time" },
    { accessorKey: "owner.name", header: "Owner" },
    { accessorKey: "creator", header: "Creator" }
  ], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })


  const subProjectFields = [
    { name: "name", label: "Sub-project name", placeholder: "Enter sub-project name", type: "text" },
    { name: "description", label: "Description", placeholder: "Enter description", type: "textarea" },
    { name: "project", label: "Project", placeholder: "Select a project", type: "select", options: projectOptions },
    { name: "partner", label: "Partner", placeholder: "Enter partner", type: "text" },
    { name: "main_discipline", label: "Discipline", placeholder: "E.g. Architecture, Structure...", type: "text" },
    { name: "location", label: "Location", placeholder: "Enter location", type: "text" },
    { name: "start_time", label: "Start Time", placeholder: "Pick start date", type: "date" },
    { name: "end_time", label: "End Time", placeholder: "Pick end date", type: "date" }
  ]

  const handleApply = async (formData: any) => {
    try {
      const payload = {
        ...formData,
        project_id: parseInt(formData.project),
      }

      await createSubProjects(payload)
      setOpen(false)
      fetchData()
    } catch (err) {
      console.error("Error creating sub-project:", err)
    }
  }


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
          onClose={() => setOpen(false)}
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
            onCancel={() => setOpen(false)}
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
        <div>Showing {data.length}</div>
        <div className="flex gap-2">
          <Button variant="ghost">«</Button>
          <div>1 of 1</div>
          <Button variant="ghost">»</Button>
        </div>
      </div>
    </div>
  )
}
