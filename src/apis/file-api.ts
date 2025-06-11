
import { fetchWithAuth2 } from "@/api";


export async function uploadFilesIntoFolder(file: File, folderId: number) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category_type", "folder");
  formData.append("category_id", folderId.toString());
  const response = await fetchWithAuth2("/files/upload", {
    method: "POST",
    body: formData,
  });
  return response;
}


export async function deleteFileById(id: number) {
  return await fetchWithAuth2(`/files/${id}`, {
    method: 'DELETE'
  });
}

export async function moveFileToFolder(fileId: number, data: any) {
  return await fetchWithAuth2(`/files/${fileId}/move`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}