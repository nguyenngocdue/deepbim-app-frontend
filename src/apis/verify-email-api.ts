import { fetchWithAuth2 } from "@/api";

export async function verifyEmail(token: string) {
    const response = await fetchWithAuth2(`/users/verify-email?token=${token}`, {
        method: 'POST',
    });
    return response;
}