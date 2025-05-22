import { getTeamByUserId } from "@/apis/team-api";
import { useCallback, useEffect, useState } from "react";

export function useTeamsByUser(user: any) {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);

  const fetchTeams = useCallback(async () => {
    // Lưu ý: Đúng là !user || !user.id mới là điều kiện dừng
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const t = await getTeamByUserId(user.id);
      setTeams(t.data || []);
    } catch (err) {
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);


  return { teams, loading, refresh: fetchTeams };
}
