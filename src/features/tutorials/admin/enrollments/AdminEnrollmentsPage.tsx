import { useCallback, useEffect, useState } from "react";
import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "@/apis/enrollment-api";
import { getUsers } from "@/apis/user-api";
import { getCourses } from "@/apis/course-api";
import { getStatuses } from "@/apis/status-api";
import { Enrollment, FormOption } from "./components/types";
import { AdminEntityPage } from "../../functions/AdminEntityPage";
import { EnrollmentSearchAndActions } from "./components/EnrollmentsSearchAndActions";
import { EnrollmentTable } from "./components/EnrollmentsTable";
import { EnrollmentDialog } from "./components/EnrollmentsDialog";
import { EnrollmentDeleteDialog } from "./components/EnrollmentsDeleteDialog";

export default function AdminEnrollmentsPage() {
  const [allUsers, setAllUsers] = useState<FormOption[]>([]);
  const [allCourses, setAllCourses] = useState<FormOption[]>([]);
  const [allEnrollments, setEnrollments] = useState<FormOption[]>([]);
  const [statuses, setStatuses] = useState<FormOption[]>([]);

  const fetchData = useCallback(async () => {
    const [userRes, courseRes, statusRes, enrollmentsRes] = await Promise.all([
      getUsers(),
      getCourses(),
      getStatuses(),
      getEnrollments(),
    ]);

    console.log(courseRes);

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

    setStatuses(
      statusRes.data
        .map((s: any) => ({
          label: s.name,
          value: String(s.id),
        }))
    );


      setEnrollments(
      enrollmentsRes.data.map((errol: any) => ({
        label: errol.title,
        value: String(errol.id),
      }))
    );

  }, []);

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <AdminEntityPage<Enrollment>
      title="Enrollments"
      description="Manage enrollments of users in courses."
      fetchList={async () => {
        const res = await getEnrollments();
        return res.data;
      }}
      createItem={createEnrollment}
      updateItem={updateEnrollment}
      deleteItem={deleteEnrollment}
      transformBeforeUpdate={(data) => ({
        ...data,
        user_id: Number(data.user_id),
        course_id: Number(data.course_id),
        status_id: Number(data.status_id),
      })}
      renderSearchBar={(open, filter, setFilter) => (
        <EnrollmentSearchAndActions
          filter={filter}
          setFilter={setFilter}
          openCreateModal={open}
        />
      )}
      renderTable={(data, filter, actions) => (
        <EnrollmentTable data={data} filter={filter} {...actions} />
      )}
      renderDialog={({ mode, modalOpen, selectedRow, handleSubmit, closeModal }) => (
        <EnrollmentDialog
          mode={mode}
          modalOpen={modalOpen}
          selectedRow={selectedRow}
          allUsers={allUsers}
          allCourses={allCourses}
          allEnrollments={allEnrollments}
          statuses={statuses}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
        />
      )}
      renderDeleteDialog={({ modalOpenDel, handleDelete, closeModal }) => (
        <EnrollmentDeleteDialog
          modalOpenDel={modalOpenDel}
          handleDeleteCourse={handleDelete}
          closeModal={closeModal}
        />
      )}
    />
  );
}
