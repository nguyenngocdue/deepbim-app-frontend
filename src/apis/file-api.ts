
import { fetchWithAuth2 } from "@/api";
import { toast } from "sonner";


export async function uploadFilesIntoFolder(file: File, folderId: number) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category_type", "folder");
    formData.append("category_id", folderId.toString());

    const response = await fetchWithAuth2("/files/upload", {
      method: "POST",
      body: formData,
    });

    if (response.statusCode === 201) {
        toast.success("A file uploaded successfully");
    }

  } catch (error: any) {
    toast.error("Error: " + error.message);
  }
}


export async function deleteFileById(id : number) {
    return await fetchWithAuth2(`/files/${id}`, {
      method: 'DELETE'
    });
}

export async function moveFileToFolder(fileId : number, data: any) {
    return await fetchWithAuth2(`/files/${fileId}/move`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
}