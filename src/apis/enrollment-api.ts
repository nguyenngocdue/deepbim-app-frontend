import { fetchWithAuth2 } from "@/api";

// Define CreateEnrollmentsDto type if not imported from elsewhere
type CreateEnrollmentsDto = {
  course_id: number;
  name: string | null;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: string | null;
  order_no: string | null;
  content: string | null;
  is_locked: boolean;
  owner_id: number | null;
  section_id: number | null;
};

export async function getEnrollments() {
    const response = await fetchWithAuth2('/enrollments');
    return response;
}

export async function getEnrollmentsBuyEnrollmentsId(course_id : number) {
    const response = await fetchWithAuth2(`/lessons/by-course?course_id=${course_id}`);
    return response;
}


export async function fetchEnrollmentsTreeByEnrollmentsId(course_id : number) {
    const response = await fetchWithAuth2(`/lessons/${course_id}/lessons-with-sections`);
    return response;
}


export async function createEnrollment(data: any) {
  const parsedData: CreateEnrollmentsDto = {
    course_id: parseInt(data.course_id, 10),
    name: data.name?.toString().trim() || null,
    title: data.title?.toString().trim() || '',
    description: data.description?.toString().trim() || null,
    video_url: data.video_url?.toString().trim() || null,
    duration: data.duration?.toString().trim() || null,
    order_no: data.order_no?.toString().trim() || null,
    content: data.content?.toString().trim() || null,
    is_locked:
      data.is_locked === 'true' || data.is_locked === true ? true :
      data.is_locked === 'false' || data.is_locked === false ? false :
      true, // default true
    owner_id: data.owner_id ? parseInt(data.owner_id, 10) : null,
    section_id: data.section_id ? parseInt(data.section_id, 10) : null,
  };

  const response = await fetchWithAuth2('/lessons', {
    method: 'POST',
    body: JSON.stringify(parsedData),
  });

  return response;
}


export async function updateEnrollment(courseId: number, data: any) {
  const _data = {
    name: data.name,
    title: data.title,
    description: data.description,
    thumbnail_url: data.thumbnail_url,
    is_free: data.is_free === "true" || data.is_free === true,
    old_price: Number(data.old_price),
    new_price: Number(data.new_price),
    status_id: Number(data.status_id),
    owner_id: Number(data.owner_id),
  };

  const response = await fetchWithAuth2(`/lessons/${courseId}`, {
    method: "PATCH",
    body: JSON.stringify(_data),
  });

  return response;
}


  export async function deleteEnrollment(lessonId : number) {
    const response = await fetchWithAuth2(`/lessons/${lessonId}/soft-remove`,
      {
        method: 'DELETE'
      }
    );
    return response;
}

