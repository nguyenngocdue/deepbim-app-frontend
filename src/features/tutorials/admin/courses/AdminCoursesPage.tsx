import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EntityListLayout } from "@/features/bim-viewer/modals/managements/components/EntityListLayout";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/apis/course-api";
import { getUsers } from "@/apis/user-api";
import { getStatuses } from "@/apis/status-api";
import { CourseSearchAndActions } from "./components/CourseSearchAndActions";
import { CourseDialog } from "./components/CourseDialog";
import { CourseTable } from "./components/CourseTable";
import { CourseDeleteDialog } from "./components/CourseDeleteDialog";
import { Course } from "./components/types";


type Mode = "create" | "edit" | "view" | null;

export default function AdminCoursesPage() {
  const [data, setData] = useState<Course[] | null>(null);
  const [filter, setFilter] = useState("");
  const [mode, setMode] = useState<Mode>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDel, setModalOpenDel] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Course | null>(null);
  const [statuses, setStatuses] = useState<FormOption[]>([]);
  const [allUsers, setAllUsers] = useState<FormOption[]>([]);

  const fetchFormData = useCallback(async () => {
    try {
      const [usersRes, statusesRes] = await Promise.all([getUsers(), getStatuses()]);
      const optionUsers = usersRes?.data?.map((user: any) => ({
        label: user.user_name,
        value: String(user.id),
      })) || [];
      const optionStatuses = statusesRes?.data?.map((status: any) => ({
        label: status.name,
        value: String(status.id),
      })) || [];
      setAllUsers(optionUsers);
      setStatuses(optionStatuses);
    } catch (err) {
      console.error("Failed to fetch form data:", err);
      setAllUsers([]);
      setStatuses([]);
      toast.error("Failed to fetch users or statuses");
    }
  }, []);

  useEffect(() => {
    if (modalOpen) {
      fetchFormData();
    }
  }, [modalOpen, fetchFormData]);

  const fetchData = useCallback(async () => {
    try {
      const res = await getCourses();
      const formatted = res.data.map((item: any) => ({
        ...item,
        updated_at: new Date(item.updated_at).toISOString().slice(0, 10),
      }));
      setData(formatted);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      toast.error("Failed to fetch courses");
      setData([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateModal = () => {
    setSelectedRow(null);
    setMode("create");
    setModalOpen(true);
  };

  const openEditModal = (row: Course) => {
    setSelectedRow(row);
    setMode("edit");
    setModalOpen(true);
  };

  const openViewModal = (row: Course) => {
    setSelectedRow(row);
    setMode("view");
    setModalOpen(true);
  };

  const openDeleteModal = (row: Course) => {
    setSelectedRow(row);
    setModalOpenDel(true);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setMode(null);
    setModalOpen(false);
    setModalOpenDel(false);
  };

  const handleDeleteCourse = async () => {
    if (!selectedRow) return;
    try {
      await deleteCourse(selectedRow.id);
      toast.success("Course deleted successfully");
      await fetchData();
      closeModal();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(
        `Delete failed: ${
          err && typeof err === "object" && "message" in err
            ? (err as any).message
            : "Unknown error"
        }`
      );
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      await createCourse(formData);
      toast.success("Created course successfully");
      await fetchData();
      closeModal();
    } catch (err) {
      console.error("Create failed:", err);
      toast.error("Error creating course");
    }
  };

  const handleEdit = async (formData: any) => {
    if (!selectedRow) return;
    try {
      await updateCourse(selectedRow.id, {
        ...formData,
        is_free: formData.is_free === "true",
        old_price: Number(formData.old_price),
        new_price: Number(formData.new_price),
        owner_id: Number(formData.owner_id),
        status_id: Number(formData.status_id),
      });
      toast.success("Updated course successfully");
      await fetchData();
      closeModal();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Error updating course");
    }
  };

  const handleSubmit = (formData: any) => {
    mode === "edit" ? handleEdit(formData) : handleCreate(formData);
  };

  const filteredCount = data?.filter((item) =>
    item?.title?.toLowerCase().includes(filter.toLowerCase())
  ).length ?? 0;

  return (
    <EntityListLayout
      title="Courses"
      description="Manage your published and draft courses."
      searchBar={
        <CourseSearchAndActions
          filter={filter}
          setFilter={setFilter}
          openCreateModal={openCreateModal}
        />
      }
      countInfo={`Showing ${filteredCount} of ${data?.length ?? 0}`}
      dialog={
        <CourseDialog
          mode={mode}
          modalOpen={modalOpen}
          selectedRow={selectedRow}
          statuses={statuses}
          allUsers={allUsers}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
        />
      }
    >
      <CourseTable
        data={data}
        filter={filter}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onView={openViewModal}
      />
      <CourseDeleteDialog
        modalOpenDel={modalOpenDel}
        closeModal={closeModal}
        handleDeleteCourse={handleDeleteCourse}
      />
    </EntityListLayout>
  );
}