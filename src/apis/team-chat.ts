
import { fetchWithAuth2 } from "@/api";

export async function markAsRead(teamId: number, messageId: number) {
    const res = await fetchWithAuth2(`/team-chat/${teamId}/messages/${messageId}/read`,
        {
            method: 'POST'
        }
    );
    return res
}


export async function getReaders(teamId: number, messageId: number) {
    const res = await fetchWithAuth2(`/team-chat/${teamId}/messages/${messageId}/readers`);
    return res
}
