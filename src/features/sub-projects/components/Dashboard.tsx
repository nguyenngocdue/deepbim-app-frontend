// features/subProject/components/Dashboard.tsx

import { useSubProjectData } from "../hooks/useSubProjectData";
import { ActionableItems } from "./ActionableItems";
import { ActivityFeed } from "./ActivityFeed";
import { LineChartCard } from "./LineChartCard";
import { StatsCards } from "./StatsCards";

interface Props {
  subProjectId: number;
}

export default function SubProjectDashboard({ subProjectId }: Props) {
  const { data, loading, error } = useSubProjectData(subProjectId);

  if (loading) return <p className="p-6 text-sm">Loading...</p>;
  if (error || !data) return <p className="p-6 text-sm text-red-600">{error || "Data not found"}</p>;

  return (
    <>
      <StatsCards data={data} />
      <LineChartCard progress={data.progressHistory} />
      <ActivityFeed />
      <ActionableItems />
    </>
  );
}
