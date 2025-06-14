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


  export async function createCourse() {
    const response = await fetchWithAuth2('/courses');
    return response;
}

export async function updateCourse(courseId: number, data: any) {
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
