import { fetchWithAuth2 } from "@/api";

export async function getStatuses() {
    const response = await fetchWithAuth2('/statuses');
    return response;
}
