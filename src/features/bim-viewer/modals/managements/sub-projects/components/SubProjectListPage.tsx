import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { TableContent } from "@/components/model-table/TableContent"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityForm } from "@/components/bim-viewer/common/EntityForm"
import { createSubProjects, getSubProjects } from "@/apis/sub-project-api"
import { getProjects } from "@/apis/project"
import { LinkId } from "@/components/common/LinkId"
import { toast } from "sonner"
import { EntityListLayout } from "../../components/EntityListLayout"
import { CLASS_NAME_DEFAULT } from "@/utils/class"
import { SearchBox } from "@/components/SearchBox"

interface SubProject {
  id: number
  name: string
  description?: string
  project?: string
  access?: string
  type?: string
  start_time?: string
  end_time?: string
  created_at?: string
  discipline?: string
  owner?: { name: string }
  creator?: { name: string }
}

export default function SubProjectListPage() {
  const [filter, setFilter] = useState("")
  const [data, setData] = useState<SubProject[] | null>(null)
  const [open, setOpen] = useState(false)
  const [projectOptions, setProjectOptions] = useState<{ label: string, value: string }[]>([])
  const [tab, setTab] = useState("subprojects")

  // Lấy danh sách project options cho select
  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      const options = res?.data.map((proj: any) => ({
        label: proj.name,
        value: proj.id.toString(),
      }))
      setProjectOptions(options)
    } catch (err) {
      setProjectOptions([])
    }
  }

  // Lấy danh sách subproject
  const fetchData = async () => {
    try {
      const res = await getSubProjects();
      const formatted = res?.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        project: item.project?.name,
        access: item.is_public ? "Public" : item.is_visible ? "Internal" : "Hidden",
        start_time: item.start_time,
        end_time: item.end_time,
        discipline: item.discipline?.name,
        creator: item.creator,
        owner: item.owner,
        created_at: formatDate(item.created_at),
      }))
      setData(formatted)
    } catch (err) {
      toast.error("Failed to fetch sub-projects")
      setData([])
    }
  }

  useEffect(() => {
    fetchData();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Bộ lọc theo tên, mô tả, dự án...
  const filteredData = useMemo(() => {
    if (!data) return []
    return data.filter((item) =>
      item.name?.toLowerCase().includes(filter.toLowerCase()) ||
      item.description?.toLowerCase().includes(filter.toLowerCase()) ||
      item.project?.toLowerCase().includes(filter.toLowerCase())
    )
  }, [filter, data])

  // Định dạng ngày
  function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10);
  }


  // Định nghĩa cột bảng
  const columns = useMemo<ColumnDef<SubProject>[]>(() => [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => (
        <LinkId id={`${row.original.id}`} tail="/dashboard" href="/managements/sub-projects" />
      )
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "project", header: "Project" },
    { accessorKey: "discipline", header: "Discipline" },

    {
      accessorKey: "start_time", header: "Start Time",
      cell: ({ getValue }) => {
        const val = getValue()
        return val ? new Date(val).toLocaleDateString() : "-"
      }
    },
    {
      accessorKey: "end_time", header: "End Time",
      cell: ({ getValue }) => {
        const val = getValue()
        return val ? new Date(val).toLocaleDateString() : "-"
      }
    },

    {
      accessorKey: "owner", header: "Owner",
      cell: ({ row }) => (
        <span title={`Id: #${row.original.owner.id}`}>{row.original.owner.user_name}</span>
      )
    },

    {
      accessorKey: "creator", header: "Creator",
      cell: ({ row }) => (
        <span title={`Id: #${row.original.owner.id}`}>{row.original.creator.user_name}</span>
      )
    }
  ], [])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  // Các trường của form tạo mới
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

  // Xử lý submit tạo mới subproject
  const handleApply = async (formData: any) => {
    try {
      const payload = {
        ...formData,
        project_id: parseInt(formData.project),
      }
      await createSubProjects(payload)
      setOpen(false)
      await fetchData()
      toast.success("Created sub-project successfully")
    } catch (err) {
      toast.error("Error creating sub-project")
    }
  }

  // Search bar và nút tạo mới
  const searchBar = (
    <>
      <Button className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`} onClick={() => setOpen(true)}>+ Create Sub-Project</Button>
      <SearchBox
        value={filter}
        onChange={setFilter}
        placeholder="Search sub- projects by name or number..."
      />
    </>
  )

  // Dialog tạo mới sub-project
  const dialog = (
    <DialogTemplate
      open={open}
      onClose={() => setOpen(false)}
      title="Create New Sub-Project"
      description="Fill in the details to create a new sub-project."
      disableOutsideClose
      className="max-w-5xl"
      iconType="create"
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
  )

  // Tab bar
  const tabs = [
    { value: "subprojects", label: "Sub-Projects" },
    { value: "templates", label: "Templates" }
  ]

  // Footer (nếu cần custom)
  const countInfo = `Showing ${filteredData.length} of ${data?.length ?? 0}`

  return (
    <EntityListLayout
      title="Sub-Projects"
      description="Manage your current and upcoming sub-projects."
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      dialog={dialog}
      searchBar={searchBar}
      countInfo={countInfo}
    >
      {data === null ? (
        <Skeleton className="w-full h-40 rounded-md" />
      ) : (
        <TableContent table={table} key={filteredData.length} />
      )}
    </EntityListLayout>
  )
}
