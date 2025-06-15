import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EntityListLayout } from "@/features/bim-viewer/modals/managements/components/EntityListLayout";
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/apis/lesson-api";
import { getUsers } from "@/apis/user-api";
import { getStatuses } from "@/apis/status-api";
import { LessonDialog } from "./components/LessonDialog";
import { LessonTable } from "./components/LessonTable";
import { LessonDeleteDialog } from "./components/LessonDeleteDialog";
import { Lesson, FormOption } from "./components/types";
import { LessonSearchAndActions } from "./components/LessonSearchAndActions";
import { getCourses } from "@/apis/course-api";
import { geLessonSections } from "@/apis/lesson-section-api";


type Mode = "create" | "edit" | "view" | null;

export default function AdminLessonsPage() {
  const [data, setData] = useState<Lesson[] | null>(null);
  const [filter, setFilter] = useState("");
  const [mode, setMode] = useState<Mode>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDel, setModalOpenDel] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Lesson | null>(null);
  const [allUsers, setAllUsers] = useState<FormOption[]>([]);

  const  [allCourses, setAllCourses] = useState([]);
  const  [sections, setSections] = useState([]);

  const fetchFormData = useCallback(async () => {
    try {
      const [usersRes, coursesRes, sectionsRef] = await Promise.all([getUsers(), getCourses(), geLessonSections()]);
      const optionUsers = usersRes?.data?.map((user: any) => ({
        label: user.user_name,
        value: String(user.id),
      })) || [];

      const optionCourses = coursesRes?.data?.map((course: any) => ({
        label: course.title,
        value: String(course.id),
      })) || [];

      const optionSections = sectionsRef?.data?.map((sec: any) => ({
        label: sec.title,
        value: String(sec.id),
      })) || [];

      setAllCourses(optionCourses);
      setSections(optionSections);
      setAllUsers(optionUsers);
    } catch (err) {
      console.error("Failed to fetch form data:", err);
      setAllUsers([]);
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
      const res = await getLessons();
      const formatted = res.data.map((item: any) => ({
        ...item,
        updated_at: new Date(item.updated_at).toISOString().slice(0, 10),
      }));
      setData(formatted);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      toast.error("Failed to fetch lessons");
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

  const openEditModal = (row: Lesson) => {
    setSelectedRow(row);
    setMode("edit");
    setModalOpen(true);
  };

  const openViewModal = (row: Lesson) => {
    setSelectedRow(row);
    setMode("view");
    setModalOpen(true);
  };

  const openDeleteModal = (row: Lesson) => {
    setSelectedRow(row);
    setModalOpenDel(true);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setMode(null);
    setModalOpen(false);
    setModalOpenDel(false);
  };

  const handleDeleteLesson = async () => {
    if (!selectedRow) return;
    try {
      await deleteLesson(selectedRow.id);
      toast.success("Lesson deleted successfully");
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
      await createLesson(formData);
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
      await updateLesson(selectedRow.id, {
        ...formData,
        is_locked: formData.is_locked,
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
      title="Lessons"
      description="Manage your published and draft courses."
      searchBar={
        <LessonSearchAndActions
          filter={filter}
          setFilter={setFilter}
          openCreateModal={openCreateModal}
        />
      }
      countInfo={`Showing ${filteredCount} of ${data?.length ?? 0}`}
          dialog={
              <LessonDialog
                  mode={mode}
                  modalOpen={modalOpen}
                  selectedRow={selectedRow}
                  allUsers={allUsers}
                  allCourses={allCourses}
                  sections={sections}
                  closeModal={closeModal}
                  handleSubmit={handleSubmit}
              />
          }
      >
      <LessonTable
        data={data}
        filter={filter}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onView={openViewModal}
      />
      <LessonDeleteDialog
        modalOpenDel={modalOpenDel}
        closeModal={closeModal}
        handleDeleteLesson={handleDeleteLesson}
      />
    </EntityListLayout>
  );
}