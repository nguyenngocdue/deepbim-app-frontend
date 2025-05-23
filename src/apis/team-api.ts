import { fetchWithAuth2 } from "@/api";
import { toast } from "sonner";

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

export async function uploadTeamAvatar(file: File, teamId: number) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category_type", "team_avatar");
    formData.append("category_id", teamId.toString());

    const response = await fetchWithAuth2(`/teams/${teamId}/avatar`, {
      method: "POST",
      body: formData,
    });

    if (response.statusCode === 201) {
        toast.success("A file uploaded successfully");
    }
  } catch (error: any) {
    toast.error("Error: " + error.message);
  }
}



export async function updateTeam(teamId: Number, data: any) {
  const res = await fetchWithAuth2(`/teams/${teamId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res
}


export async function deleteTeam(teamId: Number) {
  const res = await fetchWithAuth2(`/teams/${teamId}`, {
    method: "DELETE",
  });
  return res
}


export async function getUnreadCounts() {
  const res = await fetchWithAuth2(`/teams/unread-count`);
  return res
}
