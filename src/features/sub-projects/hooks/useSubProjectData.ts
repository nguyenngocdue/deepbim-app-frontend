// features/subProject/hooks/useSubProjectData.ts

import { useEffect, useState } from "react";

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
    async function fetchData() {
      try {
        setLoading(true);
        // Simulate API delay with setTimeout
        setTimeout(() => {
          setData({
            id: subProjectId,
            name: "Interior Fit-Out",
            discipline: "Architecture",
            status: "In Progress",
            startDate: "2024-01-01",
            endDate: "2024-06-30",
            filesUploaded: 68,
            openIssues: 5,
            rfisAnswered: 18,
            progressHistory: [
              { name: 'Week 1', Completed: 12 },
              { name: 'Week 2', Completed: 24 },
              { name: 'Week 3', Completed: 38 },
              { name: 'Week 4', Completed: 51 },
              { name: 'Week 5', Completed: 63 },
              { name: 'Week 6', Completed: 72 },
            ],
          });
          setLoading(false);
        }, 500);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [subProjectId]);

  return { data, loading, error };
}