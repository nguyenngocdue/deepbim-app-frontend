import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { TableContent } from "@/components/model-table/TableContent"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityForm } from "@/components/bim-viewer/common/EntityForm"
import { createProjects, getProjects } from "@/apis/project"
import { LinkId } from "@/components/common/LinkId"
import { EntityListLayout } from "../../components/EntityListLayout"
import { CLASS_NAME_DEFAULT } from "@/utils/class"
import { SearchBox } from "@/components/SearchBox"

interface Project {
  id: number
  name: string
  number: string
  creator?: any
  main_discipline?: any
  location?: string
  start_time?: string
  end_time?: string
  created_at?: string
  updated_at?: string
}

export default function ProjectListPage() {
  const [filter, setFilter] = useState("")
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [tab, setTab] = useState("projects")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await getProjects()
      setProjects(res?.data)
    } catch (err) {
      toast.error("Failed to fetch projects")
      setProjects([])
    }
  }

  // Dữ liệu cho bảng (filter theo tên hoặc mã số)
  const data = useMemo(() => {
    if (!projects) return []
    return projects.filter(p =>
      p.name?.toLowerCase().includes(filter.toLowerCase()) ||
      p.number?.toLowerCase().includes(filter.toLowerCase())
    )
  }, [filter, projects])

  // Định nghĩa cột bảng
  const columns = useMemo<ColumnDef<Project>[]>(() => [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => (
        <LinkId id={row.original.id} href="/managements/projects" disabled={true} />
      )
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "creator",
      header: "Creator",
      cell: ({ getValue }) => {
        const val = getValue() as any
        return val?.user_name ?? val?.name ?? val?.label ?? val?.title ?? "-"
      }
    },
    {
      accessorKey: "main_discipline",
      header: "Main Discipline",
      cell: ({ getValue }) => {
        const val = getValue() as any
        return val ?? "-"
      }
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ getValue }) => getValue() || "-"
    },
    {
      accessorKey: "start_time",
      header: "Start Time",
      cell: ({ getValue }) => {
        const val = getValue()
        return val ? new Date(val).toLocaleDateString() : "-"
      }
    },
    {
      accessorKey: "end_time",
      header: "End Time",
      cell: ({ getValue }) => {
        const val = getValue()
        return val ? new Date(val).toLocaleDateString() : "-"
      }
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) => {
        const val = getValue()
        return val ? new Date(val).toLocaleString() : "-"
      }
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ getValue }) => {
        const val = getValue()
        return val ? new Date(val).toLocaleString() : "-"
      }
    },
  ], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  // Các trường của form tạo mới dự án
  const projectFields = [
    { name: "name", label: "Project name", placeholder: "Enter project name", type: "text" },
    { name: "description", label: "Description", placeholder: "Enter project description", type: "textarea" },
    { name: "partner", label: "Partner", placeholder: "Enter partner name", type: "text" },
    { name: "main_discipline", label: "Main Discipline", placeholder: "E.g. Structure, Architecture...", type: "text" },
    { name: "location", label: "Location", placeholder: "Enter project location", type: "text" },
    { name: "start_time", label: "Start Time", placeholder: "Select start date", type: "date" },
    { name: "end_time", label: "End Time", placeholder: "Select end date", type: "date" }
  ]

  // Xử lý submit form tạo dự án mới
  const handleApply = async (formData: any) => {
    try {
      await createProjects(formData)
      setOpen(false)
      await fetchProjects()
      toast.success("Created project successfully")
    } catch (err) {
      toast.error("Failed to create project")
    }
  }

  const handleCancel = () => setOpen(false)

  // Search bar và nút tạo mới truyền vào layout
  const searchBar = (
    <>
      <Button className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`} onClick={() => setOpen(true)}>+ Create Project</Button>
      <SearchBox
        value={filter}
        onChange={setFilter}
        placeholder="Search projects by name or number..."
      />
    </>
  )

  // Dialog tạo mới truyền vào layout
  const dialog = (
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
  )

  // Tab bar (nếu sau này bạn muốn add nhiều tab, hiện mặc định là 'projects')
  const tabs = [
    { value: "projects", label: "Projects" },
    { value: "templates", label: "Templates" }
  ]

  // Footer (nếu muốn custom, còn không cứ để mặc định)
  const countInfo = `Showing ${data.length} of ${projects?.length ?? 0}`

  return (
    <EntityListLayout
      title="Projects"
      description="Manage your current and upcoming projects."
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      dialog={dialog}
      searchBar={searchBar}
      countInfo={countInfo}
    >
      {projects === null ? (
        <Skeleton className="w-full h-40 rounded-md" />
      ) : (
        <TableContent table={table} key={projects.length} />
      )}
    </EntityListLayout>
  )
}
