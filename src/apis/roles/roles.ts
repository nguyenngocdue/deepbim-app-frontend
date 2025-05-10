import { fetchWithAuth2 } from "@/api";


export async function getRoles() {
    const response = await fetchWithAuth2('/roles');
    return response;
}

export async function createRoles(data: any) {
    const response = await fetchWithAuth2('/roles', {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response;

}

export async function deleteRole(id: number) {
    const res = await fetchWithAuth2(`/roles/${id}`, {
        method: 'DELETE',
    })
    return res;
}

export async function updateRole(id: number, data: any) {
    const res = await fetchWithAuth2(`/roles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
    return res;
}

