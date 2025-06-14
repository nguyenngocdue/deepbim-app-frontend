import { fetchWithAuth2 } from "@/api";
import { toast } from "sonner";

export async function getUsers() {
    try {
      const response = await fetchWithAuth2('/users');
      return response;
    }catch (error: any) {
      toast.warning("Warning: " + error.message);
    }
}