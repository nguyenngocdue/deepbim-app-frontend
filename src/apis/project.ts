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
        return response.data ?? {};
      } catch (error: any) {
        toast.error("Error: " + error.message);
      }
}