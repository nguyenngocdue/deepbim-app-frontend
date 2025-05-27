import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Files Uploaded" value={68} progress={80} />
      <StatCard title="Open Issues" value={5} progress={40} color="text-red-500" />
      <StatCard title="RFIs Answered" value={18} progress={90} color="text-green-600" />
    </div>
  );
}

function StatCard({ title, value, progress, color }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className={`text-xl font-bold ${color ?? ''}`}>{value}</h2>
        <Progress value={progress} className="mt-2" />
      </CardContent>
    </Card>
  );
}