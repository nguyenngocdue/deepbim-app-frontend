import { apiGet, fetchWithAuth2 } from "@/api";
import { toast } from "sonner";

export async function setUserSettings(data: Object)  {
    try {
        const response = await fetchWithAuth2('/users/user-settings', {
          method: 'POST',
          body: JSON.stringify({"userSetting": data}),
        });
  
        await response.json();
        toast.success("Update Usersettings successful!");
      } catch (error: any) {
        toast.error("Error: " + error.message);
      }
}

export async function getUserSettings()  {
    try {
        const response = await apiGet('/users/user-settings');
        toast.success("Update Usersettings successful!");
        return response
      } catch (error: any) {
        toast.error("Error: " + error.message);
      }
}