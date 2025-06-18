import { useCallback, useEffect, useState } from "react";
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/apis/lesson-api";
import { getUsers } from "@/apis/user-api";
import { getCourses } from "@/apis/course-api";
import { geLessonSections } from "@/apis/lesson-section-api";
import { Lesson, FormOption } from "./components/types";
import { AdminEntityPage } from "../../functions/AdminEntityPage";
import { LessonSearchAndActions } from "./components/LessonSearchAndActions";
import { LessonTable } from "./components/LessonTable";
import { LessonDialog } from "./components/LessonDialog";
import { LessonDeleteDialog } from "./components/LessonDeleteDialog";

export default function AdminLessonsPage() {
  const [allUsers, setAllUsers] = useState<FormOption[]>([]);
  const [allCourses, setAllCourses] = useState<FormOption[]>([]);
  const [sections, setSections] = useState<FormOption[]>([]);

  const fetchData = useCallback(async () => {
    const [userRes, courseRes, sectionsRes] = await Promise.all([
      getUsers(),
      getCourses(),
      geLessonSections(),
    ]);

    setAllUsers(
      userRes.data.map((user: any) => ({
        label: user.user_name,
        value: String(user.id),
      }))
    );

    setAllCourses(
      courseRes.data.map((course: any) => ({
        label: course.title,
        value: String(course.id),
      }))
    );

    setSections(
      sectionsRes.data.map((sec: any) => ({
        label: sec.title,
        value: String(sec.id),
      }))
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AdminEntityPage<Lesson>
      title="Lessons"
      description="Manage your published and draft lessons."
      fetchList={async () => {
        const res = await getLessons();
        return res.data.map((item: any) => ({
          ...item,
          updated_at: new Date(item.updated_at).toISOString().slice(0, 10),
        }));
      }}
      createItem={createLesson}
      updateItem={updateLesson}
      deleteItem={deleteLesson}
      transformBeforeUpdate={(data) => ({
        ...data,
        old_price: Number(data.old_price),
        new_price: Number(data.new_price),
        owner_id: Number(data.owner_id),
        status_id: Number(data.status_id),
      })}
      renderSearchBar={(open, filter, setFilter) => (
        <LessonSearchAndActions
          filter={filter}
          setFilter={setFilter}
          openCreateModal={open}
        />
      )}
      renderTable={(data, filter, actions) => (
        <LessonTable data={data} filter={filter} {...actions} />
      )}
      renderDialog={({ mode, modalOpen, selectedRow, handleSubmit, closeModal }) => (
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
      )}
      renderDeleteDialog={({ modalOpenDel, handleDelete, closeModal }) => (
        <LessonDeleteDialog
          modalOpenDel={modalOpenDel}
          closeModal={closeModal}
          handleDeleteLesson={handleDelete}
        />
      )}
    />
  );
}
