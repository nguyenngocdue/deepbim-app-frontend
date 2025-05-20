

import { fetchWithAuth2 } from "@/api";

export async function addTeamMembers(data: any){
    const res = await fetchWithAuth2('/team-members', {
      method: "POST",
      body: JSON.stringify(data),
    });   
  return res
}