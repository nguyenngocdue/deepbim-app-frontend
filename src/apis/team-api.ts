import { fetchWithAuth2 } from "@/api";

export async function createTeam(data: any){
    const res = await fetchWithAuth2('/teams/', {
      method: "POST",
      body: JSON.stringify(data),
    });   
  return res
}