
import { fetchWithAuth2 } from "@/api";

export async function getMessageByTeamId(teamId: number) {
    const res = await fetchWithAuth2(`/team-chat-messages?team_id=${teamId}`);
    return res
}