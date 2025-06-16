import { fetchWithAuth2 } from "@/api";

export async function getUserLessonAccesses() {
      const response = await fetchWithAuth2('/user-lesson-accesses');
      return response;
}

export async function getInitialPermissions() {
      const response = await fetchWithAuth2('/user-lesson-accesses/initial-permissions');
      return response;
}


export async function setBulkUserLessonAccesses(accessMap: any) {
      const response = await fetchWithAuth2('/user-lesson-accesses/bulk', {
            method: "POST",
            body: JSON.stringify({ "accessMap": accessMap }),
      });
      return response;
}



