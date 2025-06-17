import { fetchWithAuth2 } from "@/api";

export async function getCourses() {
    const response = await fetchWithAuth2('/courses');
    return response;
}


export async function registerCourse(courseId : number, data: any) {
  const response = await fetchWithAuth2(`/courses/${courseId}/register`, {
    method: "POST",
    body: JSON.stringify(data)
  });
  return response;
}


interface CreateCourseDto {
  name: string;
  title: string;
  description: string;
  status_id: number;
  owner_id: number;
  is_free: boolean;
  old_price: number;
  new_price: number;
}

  export async function createCourse(data: any) {
    const parsedData: CreateCourseDto = {
    name: String(data.name || '').trim(),
    title: String(data.title || '').trim(),
    description: String(data.description || '').trim(),
    status_id: parseInt(data.status_id, 10),
    owner_id: parseInt(data.owner_id, 10),
    is_free: data.is_free === 'true' || data.is_free === true,
    old_price: parseFloat(data.old_price),
    new_price: parseFloat(data.new_price),
  };
    const response = await fetchWithAuth2('/courses', {
      method: "POST",
      body: JSON.stringify(parsedData)
    });
    return response;
}

export async function updateCourse(courseId: number, data: any) {
  const _data = {
    name: data.name,
    title: data.title,
    description: data.description,
    thumbnail_url: data.thumbnail_url,
    is_free: data.is_free,
    old_price: Number(data.old_price),
    new_price: Number(data.new_price),
    status_id: Number(data.status_id),
    owner_id: Number(data.owner_id),
  };

  const response = await fetchWithAuth2(`/courses/${courseId}`, {
    method: "PATCH",
    body: JSON.stringify(_data),
  });

  return response;
}


  export async function deleteCourse(courseId : number) {
    const response = await fetchWithAuth2(`/courses/${courseId}/soft-remove`,
      {
        method: 'PATCH'
      }
    );
    return response;
}
