import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/apis/course-api";
import { getUsers } from "@/apis/user-api";
import { getStatuses } from "@/apis/status-api";
import { AdminEntityPage } from "../../functions/AdminEntityPage";
import { CourseSearchAndActions } from "./components/CourseSearchAndActions";
import { CourseDialog } from "./components/CourseDialog";
import { CourseTable } from "./components/CourseTable";
import { CourseDeleteDialog } from "./components/CourseDeleteDialog";
import { Course, FormOption } from "./components/types";

export default function AdminCoursesPage() {
  const [statuses, setStatuses] = useState<FormOption[]>([]);
  const [allUsers, setAllUsers] = useState<FormOption[]>([]);

  const fetchFormData = useCallback(async () => {
    try {
      const [usersRes, statusesRes] = await Promise.all([getUsers(), getStatuses()]);
      setAllUsers(
        usersRes.data.map((user: any) => ({
          label: user.user_name,
          value: String(user.id),
        }))
      );
      setStatuses(
        statusesRes.data.map((status: any) => ({
          label: status.name,
          value: String(status.id),
        }))
      );
    } catch (err) {
      console.error("Error fetching form data:", err);
      toast.error("Failed to fetch users or statuses");
    }
  }, []);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  return (
    <AdminEntityPage<Course>
      title="Courses"
      description="Manage your published and draft courses."
      fetchList={async () => {
        const res = await getCourses();
        return res.data.map((item: any) => ({
          ...item,
          updated_at: new Date(item.updated_at).toISOString().slice(0, 10),
        }));
      }}
      createItem={createCourse}
      updateItem={updateCourse}
      deleteItem={deleteCourse}
      transformBeforeUpdate={(formData) => ({
        ...formData,
        is_free: formData.is_free,
        old_price: Number(formData.old_price),
        new_price: Number(formData.new_price),
        owner_id: Number(formData.owner_id),
        status_id: Number(formData.status_id),
      })}
      renderSearchBar={(open, filter, setFilter) => (
        <CourseSearchAndActions
          filter={filter}
          setFilter={setFilter}
          openCreateModal={open}
        />
      )}
      renderTable={(data, filter, actions) => (
        <CourseTable data={data} filter={filter} {...actions} />
      )}
      renderDialog={({ mode, modalOpen, selectedRow, handleSubmit, closeModal }) => (
        <CourseDialog
          mode={mode}
          modalOpen={modalOpen}
          selectedRow={selectedRow}
          statuses={statuses}
          allUsers={allUsers}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
        />
      )}
      renderDeleteDialog={({ modalOpenDel, handleDelete, closeModal }) => (
        <CourseDeleteDialog
          modalOpenDel={modalOpenDel}
          closeModal={closeModal}
          handleDeleteCourse={handleDelete}
        />
      )}
    />
  );
}
