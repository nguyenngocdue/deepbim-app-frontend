import { useSubProjectData } from "../hooks/useSubProjectData";
import { ActionableItems } from "./ActionableItems";
import { ActivityFeed } from "./ActivityFeed";
import { BIMMultiLineChart } from "./BIMMultiLineChart";
import { SimpleMap } from "./SimpleMap";
import { EChartsLineProgress } from "./EChartsLineProgress";
import BIMTaskCompletionChart from "./BIMTaskCompletionChart";
import { TeamMemberRoseChart } from "./TeamMemberRoseChart";
import { StatsCards } from "./StatsCards";
import { useDarkMode } from "@/hooks/useDarkMode";
import { SubProjectInfo } from "./SubProjectInfo";
import TimeRangeSelector from "./TimeRangeSelector";
import BIMProgressChart from "./BIMProgressChart";


interface Props {
  subProjectId: number;
}



export default function SubProjectDashboard({ subProjectId }: Props) {
  const { data, loading, error } = useSubProjectData(subProjectId);
  const isDark = useDarkMode();



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-medium text-red-600">{error || "Data not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        <div className="lg:col-span-4">
          <SubProjectInfo />
        </div>
        <div className="lg:col-span-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <TimeRangeSelector />
            </div>
            <div className="flex flex-col gap-4">
              <StatsCards data={data} />
              <ActionableItems />
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
      <BIMProgressChart />


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        <div className="lg:col-span-6">
          <BIMMultiLineChart />
        </div>
        <div className="lg:col-span-6">
          <EChartsLineProgress />
        </div>
      </div>



      {/* Section 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        <div className="lg:col-span-6">
          <TeamMemberRoseChart
            alertThreshold={15}
            title="Number of Members per Team"
          />
        </div>
        <div className="lg:col-span-6">
          <BIMTaskCompletionChart />
        </div>
      </div>

      <div className="rounded-lg">
        <SimpleMap
          lat={10.7769}
          lng={106.7009}
          name="Dự án TP. Hồ Chí Minh"
          zoom={19}
          dark={false}
        />
      </div>
    </div>
  );
}
