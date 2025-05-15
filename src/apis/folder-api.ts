import { fetchWithAuth2 } from "@/api";
import { toast } from "sonner";


export async function createFolder(data: any) {
  const response = await fetchWithAuth2('/folders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response;
}


export async function getFolderTree(entityId:number) {
    try {
        const res = await fetchWithAuth2(`/folders/sub-project/${entityId}/tree?`);
        return res;
     } catch (error: any) {
        toast.error("Error: " + error.message);
    }
}

export async function getFoldersBySubProjectId(subProjectId: number) {
    try {
        const res = await fetchWithAuth2(`/folders/by-sub-project/${subProjectId}`);
        return res;
     } catch (error: any) {
        toast.error("Error: " + error.message);
    }
}


export async function renameFolder(id: number, newName: string) {
  const res = await fetchWithAuth2(`/folders/${id}/rename`, {
    method: "PUT",
    body: JSON.stringify({ name: newName }),
  })
  return res;
}

export async function deleteFolder(id:number) {
  const res = await fetchWithAuth2(`/folders/${id}`, {
    method: "DELETE",
  })
  return res;
}


