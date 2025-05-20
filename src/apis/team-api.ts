import { fetchWithAuth2 } from "@/api";

export async function getTeams() {
  const res = await fetchWithAuth2('/teams');
  return res
}

export async function getTeamByUserId(id: number) {
  const res = await fetchWithAuth2(`/teams/user/${id}`);
  return res
}


export async function createTeam(data: any) {
  const res = await fetchWithAuth2('/teams', {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res
}