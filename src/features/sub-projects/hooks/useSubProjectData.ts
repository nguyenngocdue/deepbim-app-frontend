// features/subProject/hooks/useSubProjectData.ts

import { useEffect, useState } from "react";
import { getSubProject } from "@/apis/sub-project-api"; // Import hàm API thực tế

export interface SubProjectData {
  id: string;
  name: string;
  discipline: string;
  status: string;
  startDate: string;
  endDate: string;
  filesUploaded: number;
  openIssues: number;
  rfisAnswered: number;
  progressHistory: { name: string; Completed: number }[];
}

export function useSubProjectData(subProjectId: number) {
  const [data, setData] = useState<SubProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Gọi API thực tế
        const response = await getSubProject(subProjectId);
        // Tùy thuộc vào API của bạn trả về như thế nào:
        // Nếu là { data: {...} } thì dùng response.data
        // Nếu là {...} thì dùng trực tiếp
        if (!ignore) setData(response.data || response);
      } catch (err: any) {
        if (!ignore) setError(err?.message ?? "Unknown error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (subProjectId) fetchData();
    else setLoading(false);

    return () => {
      ignore = true; // tránh race condition nếu component unmount sớm
    };
  }, [subProjectId]);

  return { data, loading, error };
}
