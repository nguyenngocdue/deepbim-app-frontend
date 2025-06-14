import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EntityListLayout } from "@/features/bim-viewer/modals/managements/components/EntityListLayout";

type Mode = "create" | "edit" | "view" | null;

interface AdminEntityPageProps<T> {
  title: string;
  description: string;
  fetchList: () => Promise<T[]>;
  createItem: (data: any) => Promise<any>;
  updateItem: (id: number, data: any) => Promise<any>;
  deleteItem: (id: number) => Promise<any>;

  renderSearchBar: (openCreate: () => void, filter: string, setFilter: (f: string) => void) => React.ReactNode;
  renderTable: (data: T[] | null, filter: string, actions: Actions<T>) => React.ReactNode;
  renderDialog: (props: DialogProps<T>) => React.ReactNode;
  renderDeleteDialog: (props: DeleteDialogProps) => React.ReactNode;

  transformBeforeUpdate?: (formData: any) => any;
}

type Actions<T> = {
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onView: (row: T) => void;
};

type DialogProps<T> = {
  mode: Mode;
  modalOpen: boolean;
  selectedRow: T | null;
  handleSubmit: (formData: any) => void;
  closeModal: () => void;
};

type DeleteDialogProps = {
  modalOpenDel: boolean;
  handleDelete: () => void;
  closeModal: () => void;
};

export function AdminEntityPage<T>({
  title,
  description,
  fetchList,
  createItem,
  updateItem,
  deleteItem,
  renderSearchBar,
  renderTable,
  renderDialog,
  renderDeleteDialog,
  transformBeforeUpdate,
}: AdminEntityPageProps<T>) {
  const [data, setData] = useState<T[] | null>(null);
  const [filter, setFilter] = useState("");
  const [mode, setMode] = useState<Mode>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDel, setModalOpenDel] = useState(false);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetchList();
      setData(res);
    } catch (err) {
      toast.error(`Failed to fetch data, ${err instanceof Error ? err.message : String(err)}`);
      setData([]);
    }
  }, [fetchList]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateModal = () => {
    setSelectedRow(null);
    setMode("create");
    setModalOpen(true);
  };

  const openEditModal = (row: T) => {
    setSelectedRow(row);
    setMode("edit");
    setModalOpen(true);
  };

  const openViewModal = (row: T) => {
    setSelectedRow(row);
    setMode("view");
    setModalOpen(true);
  };

  const openDeleteModal = (row: T) => {
    setSelectedRow(row);
    setModalOpenDel(true);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setMode(null);
    setModalOpen(false);
    setModalOpenDel(false);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    try {
      const id = (selectedRow as any).id;
      await deleteItem(id);
      toast.success("Deleted successfully");
      await fetchData();
      closeModal();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      await createItem(formData);
      toast.success("Created successfully");
      await fetchData();
      closeModal();
    } catch (err) {
      toast.error("Create failed");
    }
  };

  const handleEdit = async (formData: any) => {
    if (!selectedRow) return;
    try {
      const id = (selectedRow as any).id;
      const payload = transformBeforeUpdate ? transformBeforeUpdate(formData) : formData;
      await updateItem(id, payload);
      toast.success("Updated successfully");
      await fetchData();
      closeModal();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleSubmit = (formData: any) => {
    mode === "edit" ? handleEdit(formData) : handleCreate(formData);
  };

  const filteredCount = useMemo(
    () => data?.filter((item: any) =>
      item?.title?.toLowerCase().includes(filter.toLowerCase())
    ).length ?? 0,
    [data, filter]
  );

  return (
    <EntityListLayout
      title={title}
      description={description}
      searchBar={renderSearchBar(openCreateModal, filter, setFilter)}
      countInfo={`Showing ${filteredCount} of ${data?.length ?? 0}`}
      dialog={renderDialog({
        mode,
        modalOpen,
        selectedRow,
        handleSubmit,
        closeModal,
      })}
    >
      {renderTable(data, filter, {
        onEdit: openEditModal,
        onDelete: openDeleteModal,
        onView: openViewModal,
      })}
      {renderDeleteDialog({
        modalOpenDel,
        closeModal,
        handleDelete,
      })}
    </EntityListLayout>
  );
}
