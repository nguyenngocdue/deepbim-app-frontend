
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


export async function getFilesByFolder() {
    
}