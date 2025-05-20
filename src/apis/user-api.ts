import { fetchWithAuth2 } from "@/api";

export async function getUsers() {
    const response = await fetchWithAuth2('/users');
    return response;
}