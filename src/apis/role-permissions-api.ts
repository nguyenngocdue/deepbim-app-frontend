import { fetchWithAuth2 } from "@/api";

export async function createRolePermissions(data: any) {
    const response = await fetchWithAuth2('/role-permissions', {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response;
}

export async function getRolePermissions() {
    const response = await fetchWithAuth2(`/role-permissions`);
    return response;
}

export async function deleteRolePermissions(id: number) {
    const response = await fetchWithAuth2(`/role-permissions/${id}`, {method: 'DELETE'});
    return response;
}

export async function updateRolePermissions(id: number, data: any) {
    const response = await fetchWithAuth2(`/role-permissions/${id}`, {method: 'PUT', body: JSON.stringify(data),});
    return response;
}