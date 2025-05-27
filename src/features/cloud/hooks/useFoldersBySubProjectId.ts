import { useEffect, useState } from "react";
import { getFoldersBySubProjectId } from "@/apis/folder-api";
import { FolderData } from "../components/Type";

export function useFoldersBySubProjectId(entityId: number) {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFolders = async () => {
      try {
        setLoading(true);
        const response = await getFoldersBySubProjectId(entityId);
        if (isMounted) {
          setFolders(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFolders();

    return () => {
      isMounted = false;
    };
  }, [entityId]);

  return { folders, loading, error };
}
