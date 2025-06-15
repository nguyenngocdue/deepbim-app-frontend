import { fetchWithAuth2 } from "@/api";

// Define CreateEnrollmentsDto type if not imported from elsewhere
type CreateEnrollmentsDto = {
  user_id: number;
  course_id: number;
  status_id: number;
  full_name: string | null;
  order_no: string | null;
  phone: string | null;
  email: string | null;
  linked_link: string | null;
  zalo_link: string | null;
};


export async function getEnrollments() {
  const response = await fetchWithAuth2('/enrollments');
  return response;
}

export async function getEnrollmentsBuyEnrollmentsId(course_id: number) {
  const response = await fetchWithAuth2(`/enrollments/by-course?course_id=${course_id}`);
  return response;
}


export async function fetchEnrollmentsTreeByEnrollmentsId(course_id: number) {
  const response = await fetchWithAuth2(`/enrollments/${course_id}/enrollments-with-sections`);
  return response;
}


export async function createEnrollment(data: any) {
  const parsedData: CreateEnrollmentsDto = {
    user_id: Number(data.user_id),
    course_id: Number(data.course_id),
    status_id: Number(data.status_id),
    full_name: data.full_name?.trim() || null,
    phone:  data.order_no?.trim() || null,
    email:  data.email?.trim() || null,
    linked_link:  data.linked_link?.trim() || null,
    zalo_link:  data.zalo_link?.trim() || null,
  };
  const response = await fetchWithAuth2('/enrollments', {
    method: 'POST',
    body: JSON.stringify(parsedData),
  });

  return response;
}


export async function updateEnrollment(enrollmentId: number, data: any) {
  const response = await fetchWithAuth2(`/enrollments/${enrollmentId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response;
}


export async function deleteEnrollment(enrollmentId: number) {
  const response = await fetchWithAuth2(`/enrollments/${enrollmentId}/soft-remove`,
    {
      method: 'DELETE'
    }
  );
  return response;
}

export async function getUserEnrollments() {
  const response = await fetchWithAuth2('/enrollments/user-enrollments');
  return response;
}
