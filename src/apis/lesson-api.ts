import { fetchWithAuth2 } from "@/api";

export async function getLessonsBuyCourseId(course_id : number) {
    const response = await fetchWithAuth2(`/lessons/by-course?course_id=${course_id}`);
    return response;
}


export async function fetchLessonTreeByCourseId(course_id : number) {
    const response = await fetchWithAuth2(`/courses/${course_id}/lessons-with-sections`);
    return response;
}
