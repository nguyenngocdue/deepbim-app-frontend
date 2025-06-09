import { apiGet, fetchWithAuth2 } from "@/api";
import { toast } from "sonner";


export async function createProjects(data: any) {
  try {
    const payload = {
      ...data,
      start_time: data.start_time?.toISOString(),
      end_time: data.end_time?.toISOString()
    };
    const response = await fetchWithAuth2('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await response;
    toast.success("A project was created successfully");
  } catch (error: any) {
    toast.error("Error: " + error.message);
  }
}


export async function getProjects() {
  try {
    const response = await apiGet('/projects') as { data: any };
    return response ?? {};
  } catch (error: any) {
    toast.error("Error: " + error.message);
  }
}


export async function updateProject(id: number, data: any) {
  try {
    const res = await fetchWithAuth2(`/projects/${id}`, {
      method: 'Patch',
      body: JSON.stringify(data)
    });
    console.log(res)
    if(res.ok) {
      toast.success("A project was updated successfully");
    }
  } catch (error: any) {
    toast.error("Error: " + error.message);
  }
}

export async function deleteProject(id: number) {
  const response = await fetchWithAuth2(`/projects/${id}`, {
    method: 'DELETE',
  });
  return response;
}