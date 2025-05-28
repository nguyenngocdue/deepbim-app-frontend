import { Card } from "@/components/ui/card";
import { FileText, AlertCircle, MailCheck, DollarSign } from "lucide-react";

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value="$45,231.89"
        icon={<DollarSign className="w-5 h-5" />}
        sub="+20.1% from last month"
        subColor="text-green-500"
      />
      <StatCard
        title="Files Uploaded"
        value="68"
        icon={<FileText className="w-5 h-5" />}
        sub="+12 files this week"
      />
      <StatCard
        title="Open Issues"
        value="5"
        icon={<AlertCircle className="w-5 h-5" />}
        sub="3 critical"
        subColor="text-red-500"
      />
      <StatCard
        title="RFIs Answered"
        value="18"
        icon={<MailCheck className="w-5 h-5" />}
        sub="90% completion"
        subColor="text-green-500"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  sub,
  subColor = "text-muted-foreground",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
  subColor?: string;
}) {
  return (
    <Card className="bg-white dark:bg-zinc-950 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 rounded-xl p-5 relative overflow-hidden">
      <div className="absolute top-4 right-4 text-muted-foreground dark:text-zinc-400">
        {icon}
      </div>
      <p className="text-sm text-muted-foreground dark:text-zinc-400 mb-1">
        {title}
      </p>
      <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
      {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
    </Card>
  );
}
