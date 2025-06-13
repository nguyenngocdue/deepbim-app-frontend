import { fetchWithAuth2 } from "@/api";

export async function getCourses() {
    const response = await fetchWithAuth2('/courses');
    return response;
}
