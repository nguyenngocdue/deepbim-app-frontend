import { fetchWithAuth2 } from "@/api";

export async function getCourses() {
    const response = await fetchWithAuth2('/courses');
    return response;
}


export async function registerCourse(courseId : number, data: any) {
    console.log(data)
    const response = await fetchWithAuth2(`/courses/${courseId}/register`, {
         method: "POST",
       body: JSON.stringify(data)
    });
    return response;
}