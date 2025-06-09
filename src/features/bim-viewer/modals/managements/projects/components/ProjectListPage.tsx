import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { TableContent } from "@/components/model-table/TableContent";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { EntityForm } from "@/components/bim-viewer/common/EntityForm";
import { createProjects, deleteProject, getProjects, updateProject } from "@/apis/project";
import { LinkId } from "@/components/common/LinkId";
import { toast } from "sonner";
import { EntityListLayout } from "../../components/EntityListLayout";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { SearchBox } from "@/components/SearchBox";
import { TableRowActions } from "@/components/bim-viewer/common/TableRowActions";
import { FormActionButtons } from "@/components/bim-viewer/common/FormActionButtons";
import { IoCreateOutline } from "react-icons/io5";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { AvatarUser } from "@/components/AvatarUser";

type Mode = "create" | "edit" | "view" | null;

interface Project {
  id: number;
  name: string;
  number: string;
  description?: string;
  partner?: string;
  main_discipline?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
  creator?: any;
}

export default function ProjectListPage() {
  const [filter, setFilter] = useState("");
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDel, setModalOpenDel] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const formRef = useRef<{ submit: () => void }>(null);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      const res = await getProjects();
      setProjects(res?.data);
    } catch {
      toast.error("Failed to fetch projects");
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!projects) return [];
    return projects.filter(
      (p) =>
        p.name?.toLowerCase().includes(filter.toLowerCase()) ||
        p.number?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, projects]);

  // Columns for react-table
  const columns = useMemo<ColumnDef<Project>[]>(() => [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => <LinkId id={row.original.id} href="/managements/projects" disabled />,
    },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "creator",
      header: "Creator",
      cell: ({ getValue }) => {
        const val = getValue() as any;
       return <AvatarUser name={val.user_name} img={val.picture} id={val.id}/>
      },
    },
    {
      accessorKey: "main_discipline",
      header: "Main Discipline",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    { accessorKey: "location", header: "Location", cell: ({ getValue }) => getValue() || "-" },
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
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? new Date(val).toLocaleString() : "-";
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? new Date(val).toLocaleString() : "-";
      },
    },
    {
      id: "actions",
      header: "Actions",
      size: 110,
      cell: ({ row }) => (
        <TableRowActions
          row={row.original}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onView={openViewModal}
          showEdit
          showDelete
          showView
        />
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Form fields for create/edit
  const projectFields = [
    { name: "name", label: "Project name", placeholder: "Enter project name", type: "text", required: true },
    { name: "description", label: "Description", placeholder: "Enter project description", type: "textarea" },
    { name: "partner", label: "Partner", placeholder: "Enter partner name", type: "text" },
    { name: "main_discipline", label: "Main Discipline", placeholder: "E.g. Structure, Architecture...", type: "text" },
    { name: "location", label: "Location", placeholder: "Enter project location", type: "text" },
    { name: "start_time", label: "Start Time", placeholder: "Select start date", type: "date" },
    { name: "end_time", label: "End Time", placeholder: "Select end date", type: "date" },
  ];

  // Modal open handlers
  const openCreateModal = () => {
    setSelectedProject(null);
    setMode("create");
    setModalOpen(true);
  };

  const openEditModal = (row: Project) => {
    setSelectedProject(row);
    setMode("edit");
    setModalOpen(true);
  };

  const openViewModal = (row: Project) => {
    setSelectedProject(row);
    setMode("view");
    setModalOpen(true);
  };

  const openDeleteModal = (row: Project) => {
    setSelectedProject(row);
    setModalOpenDel(true);
  };

  // Close modal (both dialog and delete)
  const closeModal = () => {
    setModalOpen(false);
    setModalOpenDel(false);
    setSelectedProject(null);
    setMode(null);
  };

  // Delete project handler
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    try {
      const res = await deleteProject(selectedProject.id);
      if (res.ok) {
        toast.success("Project deleted successfully.");
        setModalOpenDel(false);
        await fetchProjects();
      } else {
        toast.error(`Delete failed with status: ${res.status}`);
      }
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message || error}`);
    }
  };

  // Submit form from outside via ref
  const formSubmitHandler = () => {
    if (formRef.current) formRef.current.submit();
  };

  // Form submit handler (create or update)
  const handleSubmit = async (formData: any) => {
    console.log(selectedProject);
    try {
      if (mode === "edit" && selectedProject) {
        await updateProject(selectedProject.id, formData);
      } else if (mode === "create") {
        await createProjects(formData);
        toast.success("Project created successfully");
      }
      closeModal();
      await fetchProjects();
    } catch {
      toast.error(mode === "edit" ? "Failed to update project" : "Failed to create project");
    }
  };

  // Default values for form
  const editDefaultValues = selectedProject
    ? {
        ...selectedProject,
      }
    : {};

  // Dialog JSX
  const dialog = (
    <DialogTemplate
      open={modalOpen}
      onClose={closeModal}
      title={
        mode === "create"
          ? "Create New Project"
          : mode === "edit"
          ? "Edit Project"
          : "View Project"
      }
      description={
        mode === "view"
          ? "View project details"
          : mode === "edit"
          ? "Update project details"
          : "Enter details to create a new project"
      }
      disableOutsideClose
      className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col"
      iconType={mode}
      onApply={formSubmitHandler}
      onApplyText="Apply"
      onCancelText="Cancel"
      applyType="button"
    >
      <div className="flex-grow overflow-auto pr-1">
        <EntityForm
          ref={formRef}
          fields={projectFields}
          defaultValues={editDefaultValues}
          onSubmit={handleSubmit}
          mode={mode === "view" ? "view" : "edit"}
          cancelLabel="Cancel"
          showFooter
          onCancel={closeModal}
        />
      </div>
    </DialogTemplate>
  );

  // Search + Create button
  const searchBar = (
    <>
      <Button className={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE} onClick={openCreateModal}>
        + Create Project
      </Button>
      <SearchBox value={filter} onChange={setFilter} placeholder="Search projects by name or number..." />
    </>
  );

  // Tabs (if needed)
  const tabs = [
    { value: "projects", label: "Projects" },
    { value: "templates", label: "Templates" },
  ];

  const countInfo = `Showing ${filteredData.length} of ${projects?.length ?? 0}`;

  return (
    <>
      <EntityListLayout
        title="Projects"
        description="Manage your current and upcoming projects."
        tabs={tabs}
        activeTab="projects"
        onTabChange={() => {}}
        dialog={dialog}
        searchBar={searchBar}
        countInfo={countInfo}
      >
        {projects === null ? (
          <LoadingState/>
        ) : (
          <TableContent table={table} key={filteredData.length} />
        )}
      </EntityListLayout>

      <ConfirmDeleteDialog
        open={modalOpenDel}
        onClose={closeModal}
        onConfirm={handleDeleteProject}
        itemName={selectedProject?.name ?? "this item"}
      />
    </>
  );
}
