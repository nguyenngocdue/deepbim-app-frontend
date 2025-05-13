import { fetchWithAuth2 } from "@/api";
import { toast } from "sonner";


export async function createFolder(data: any) {
    try {
        const response = await fetchWithAuth2('/folders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        await response;
        toast.success("A folder was created successfully");
    } catch (error: any) {
        toast.error("Error: " + error.message);
    }
}

export async function getFolderTree(entityId:number) {
    try {
        const res = await fetchWithAuth2(`/folders/sub-project/${entityId}/tree?`);
        return res;
     } catch (error: any) {
        toast.error("Error: " + error.message);
    }
}

