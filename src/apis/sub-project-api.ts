import { apiGet, fetchWithAuth2 } from "@/api";
import { stringify } from "node:querystring";
import { toast } from "sonner";


export async function createSubProjects(data: any) {
  try {
    const payload = {
      ...data,
      start_time: data.start_time?.toISOString(),
      end_time: data.end_time?.toISOString()
    };
    const response = await fetchWithAuth2('/sub-projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await response;
    toast.success("A project was created successfully");
  } catch (error: any) {
    toast.error("Error: " + error.message);
  }
}


export async function getSubProjects() {
  try {
    const response = await apiGet('/sub-projects') as { data: any };
    return response || {};
  } catch (error: any) {
    toast.error("Error: " + error.message);
  }
}

export async function getSubProject(id: number) {
  const response = await fetchWithAuth2(`/sub-projects/${id}`);
  return response;

}


export async function updateSubProject(id: number, data: any) {
   const response = await fetchWithAuth2(`/sub-projects/${id}`, {
    method:'PUT',
    body: JSON.stringify(data)
   });
  return response;
}

export async function deleteSubProject(id: number) {
   const response = await fetchWithAuth2(`/sub-projects/${id}`, {
    method:'DELETE',
   });
  return response;
}