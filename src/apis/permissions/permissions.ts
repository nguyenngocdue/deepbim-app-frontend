import { fetchWithAuth2 } from "@/api";

export async function getPermissions() {
  return await fetchWithAuth2('/permissions')
}

export async function createPermissions(data: any) {
  return await fetchWithAuth2('/permissions', {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function deletePermissions(id: number) {
  return await fetchWithAuth2(`/permissions/${id}`, {
    method: "DELETE",
  })
}

export async function updatePermissions(id: number, permissionIds: number[]) {
  return await fetchWithAuth2(`/roles/${id}/permissions`, {
    method: "PATCH",
    body: JSON.stringify({'permissionIds':permissionIds})
  })
}

