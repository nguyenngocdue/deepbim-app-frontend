import { fetchWithAuth2 } from "@/api";

export async function geLessonSections() {
    const response = await fetchWithAuth2('/lesson-sections');
    return response;
}
