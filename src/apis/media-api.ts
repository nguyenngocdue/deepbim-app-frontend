import { fetchWithAuth2 } from "@/api";


export async function getMedia(userId: number) {
    const response = await fetchWithAuth2(`/media/user/${userId}`);
    return response;
}