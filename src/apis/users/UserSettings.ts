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

export async function fetchUserRoles(userId: number, roleIds: number[]) {
  try {
    await fetchWithAuth2(`/users/${userId}/roles`, {
        method: "PATCH",
        body: JSON.stringify({ "role_ids": roleIds })
    });
  }catch (error: any) {
    toast.error("Error: " + error.message);
  }
}

export async function getUsers() {
    try {
      const response = await apiGet('/users');
      return response;
    }catch (error: any) {
      toast.error("Error: " + error.message);
    }
}

export async function getUserRoles() {
  try {
    const response = await apiGet(`/user-roles`);
    return response;
  }catch (error: any) {
    toast.error("Error: " + error.message);
  }
}

export async function deleteUserRoles(id: number) {
    const res = await fetchWithAuth2(`/user-roles/${id}`, {
        method: 'DELETE',
    })
    return res;
}


export async function createNewUser(data: any){
    const res = await fetchWithAuth2('/users/create', {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.success === false) {
    throw new Error(res.message || 'Failed to create user')
  }

  return res
}

export async function fetchAdminId(): Promise<number> {
  const res = await fetchWithAuth2('/users/admins');
  return res;
}

