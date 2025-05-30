import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { TableContent } from "@/components/model-table/TableContent"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityForm } from "@/components/bim-viewer/common/EntityForm"
import { createSubProjects, deleteSubProject, getSubProjects, updateSubProject } from "@/apis/sub-project-api"
import { getProjects } from "@/apis/project"
import { LinkId } from "@/components/common/LinkId"
import { toast } from "sonner"
import { EntityListLayout } from "../../components/EntityListLayout"
import { CLASS_NAME_DEFAULT } from "@/utils/class"
import { SearchBox } from "@/components/SearchBox"
import { TableRowActions } from "@/components/bim-viewer/common/TableRowActions"
import { FormActionButtons } from "@/components/bim-viewer/common/FormActionButtons"
import { IoCreateOutline } from "react-icons/io5"
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog"


type Mode = "create" | "edit" | null;

export default function SubProjectListPage() {
  const [filter, setFilter] = useState("");
  const [data, setData] = useState<SubProject[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDel, setModalOpenDel] = useState(false);

  const [mode, setMode] = useState<Mode>(null);
  const [selectedRow, setSelectedRow] = useState<SubProject | null>(null);
  const [projectOptions, setProjectOptions] = useState<{ label: string; value: string }[]>([]);
  const [tab, setTab] = useState("subprojects");

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      const res = await getProjects();
      const options = res?.data.map((proj: any) => ({
        label: proj.name,
        value: proj.id.toString(),
      }));
      setProjectOptions(options);
    } catch {
      setProjectOptions([]);
    }
  }, []);

  // Fetch subprojects
  const fetchData = useCallback(async () => {
    try {
      const res = await getSubProjects();
      const formatted = res?.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        project: item.project?.name,
        project_id: item.project?.id,
        access: item.is_public ? "Public" : item.is_visible ? "Internal" : "Hidden",
        start_time: item.start_time,
        end_time: item.end_time,
        discipline: item.discipline?.name,
        creator: item.creator,
        owner: item.owner,
        created_at: formatDate(item.created_at),
      }));
      setData(formatted);
    } catch {
      toast.error("Failed to fetch sub-projects");
      setData([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchProjects();
  }, [fetchData, fetchProjects]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.description?.toLowerCase().includes(filter.toLowerCase()) ||
        item.project?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, data]);

  function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10);
  }

  // Mở modal tạo mới
  const openCreateModal = () => {
    setSelectedRow(null);
    setMode("create");
    setModalOpen(true);
  };

  // Mở modal sửa
  const openEditModal = (row: SubProject) => {
    setSelectedRow(row);
    setMode("edit");
    setModalOpen(true);
  };

  const openViewModal = (row: SubProject) => {
    setSelectedRow(row);
    setMode("view");
    setModalOpen(true);
  }

  const handleDeleteSubProject = async () => {
    try {
      const res = await deleteSubProject(selectedRow.id);
      if (res.ok) {
        toast.success("Sub-Project deleted successfully.");
      } else {
        toast.error(`Delete failed with status: ${res.status}`);
      }
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message || error}`);
    }
     await fetchData();
  };

  const openDeleteModal = (row: SubProject) => {
    setModalOpenDel(true);
    setSelectedRow(row)
  }


  // Đóng modal
  const closeModal = () => {
    setSelectedRow(null);
    setMode(null);
    setModalOpen(false);
    setModalOpenDel(false);
  };

  // Tạo mới sub-project
  const handleApplyCreate = async (formData: any) => {
    try {
      const payload = {
        ...formData,
        project_id: parseInt(formData.project),
      };
      await createSubProjects(payload);
      closeModal();
      await fetchData();
      toast.success("Created sub-project successfully");
    } catch {
      toast.error("Error creating sub-project");
    }
  };

  // Cập nhật sub-project
  const handleApplyEdit = async (formData: any) => {
    try {
      if (!selectedRow) return;
      const payload = {
        ...formData,
        project_id: parseInt(formData.project),
      };
      await updateSubProject(selectedRow.id, payload);
      closeModal();
      await fetchData();
      toast.success("Updated sub-project successfully");
    } catch {
      toast.error("Error updating sub-project");
    }
  };

  // Xử lý submit chung theo mode
  const handleSubmit = (formData: any) => {
    if (mode === "edit") {
      handleApplyEdit(formData);
    } else {
      handleApplyCreate(formData);
    }
  };

  // Columns
  const columns = useMemo<ColumnDef<SubProject>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => <LinkId id={`${row.original.id}`} tail="/dashboard" href="/managements/sub-projects" />,
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "project", header: "Project" },
      { accessorKey: "discipline", header: "Discipline" },
      {
        accessorKey: "start_time",
        header: "Start Time",
        cell: ({ getValue }) => {
          const val = getValue();
          return val ? new Date(val).toLocaleDateString() : "-";
        },
      },
      {
        accessorKey: "end_time",
        header: "End Time",
        cell: ({ getValue }) => {
          const val = getValue();
          return val ? new Date(val).toLocaleDateString() : "-";
        },
      },
      {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => <span title={`Id: #${row.original.owner?.id}`}>{row.original.owner?.user_name}</span>,
      },
      {
        accessorKey: "creator",
        header: "Creator",
        cell: ({ row }) => <span title={`Id: #${row.original.creator?.id}`}>{row.original.creator?.user_name}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TableRowActions
            row={row.original}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onView={openViewModal}
            showEdit={true}
            showDelete={true}
            showView={true}
          />
        ),
        size: 110,
        meta: { width: 110 },
      },
    ],
    []
  );

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Fields form
  const subProjectFields = [
    { name: "name", label: "Sub-project name", placeholder: "Enter sub-project name", type: "text", required: true },
    { name: "description", label: "Description", placeholder: "Enter description", type: "textarea", required: true },
    { name: "project", label: "Project", placeholder: "Select a project", type: "select", options: projectOptions, required: true },
    { name: "partner", label: "Partner", placeholder: "Enter partner", type: "text" },
    { name: "main_discipline", label: "Discipline", placeholder: "E.g. Architecture, Structure...", type: "text" },
    { name: "location", label: "Location", placeholder: "Enter location", type: "text" },
    { name: "start_time", label: "Start Time", placeholder: "Pick start date", type: "date" },
    { name: "end_time", label: "End Time", placeholder: "Pick end date", type: "date" },
  ];

  const formRef = useRef<{ submit: () => void }>(null);

  const formSubmitHandler = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  // Default values cho form edit
  const editDefaultValues = selectedRow
    ? {
      ...selectedRow,
      project: selectedRow.project_id
        ? projectOptions.find(opt => opt.value === String(selectedRow.project_id))?.value || ""
        : "",
    }
    : {};

  // Dialog
  const dialog = (
    <DialogTemplate
      open={modalOpen}
      onClose={closeModal}
      title={mode === "edit" ? "Edit Sub-Project" : "Create New Sub-Project"}
      description={mode === "edit" ? "Update sub-project details." : "Fill in the details to create a new sub-project."}
      disableOutsideClose
      className="max-w-5xl max-h-[80%] overflow-y-auto"
      iconType={mode === "edit" ? "edit" : "create"}
      footer={
        // Footer riêng biệt với nút Cancel và Apply
        <FormActionButtons
          onCancel={closeModal}
          onCancelText="Cancel"
          onApplyText={mode === "edit" ? "Save" : "Create"}
          onApplyIcon={<IoCreateOutline />}
          classNameDelete={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_DELETE}
          classNameApply={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}
          applyType="button" // phải là button để không submit form ngầm
          onApply={formSubmitHandler}
        />
      }
    >
      <EntityForm
        ref={formRef}
        fields={subProjectFields}
        defaultValues={editDefaultValues}
        onSubmit={handleSubmit}
        mode={mode}
        cancelLabel="Cancel"
        showFooter
        onCancel={closeModal}
      />
    </DialogTemplate>
  );

  // Search and create button
  const searchBar = (
    <>
      <Button className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`} onClick={openCreateModal}>
        + Create Sub-Project
      </Button>
      <SearchBox value={filter} onChange={setFilter} placeholder="Search sub-projects by name or number..." />
    </>
  );

  // Tabs
  const tabs = [
    { value: "subprojects", label: "Sub-Projects" },
    { value: "templates", label: "Templates" },
  ];

  // Footer info
  const countInfo = `Showing ${filteredData.length} of ${data?.length ?? 0}`;

  return (
    <>
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

      <ConfirmDeleteDialog
        open={modalOpenDel}
        onClose={closeModal}
        onConfirm={handleDeleteSubProject}
        itemName="this item"
      />
    </>
  );
}
