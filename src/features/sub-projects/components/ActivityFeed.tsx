import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Upload, AlertCircle } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { SectionDivider } from "@/components/common/SectionDivider";

interface Activity {
  id: number;
  description: string;
  icon: "file" | "issue" | "submittal";
  timestamp: string;
}

export function ActivityFeed() {
  const isDark = useDarkMode();

  const activities: Activity[] = [
    {
      id: 1,
      description: "File <strong class='text-[#FDDD60]'>A1.1</strong> uploaded by <span class='text-[#FF8A45]'>Liam</span>",
      icon: "file",
      timestamp: "Wed, May 28, 2025, 09:44 PM +07",
    },
    {
      id: 2,
      description: "Issue <strong class='text-[#FF6E76]'>#102</strong> resolved by <span class='text-[#7CFFB2]'>Ella</span>",
      icon: "issue",
      timestamp: "3d ago",
    },
    {
      id: 3,
      description: "Submittal <strong class='text-[#59D9F9]'>#22</strong> reviewed by <span class='text-[#FF8A45]'>Henry</span>",
      icon: "submittal",
      timestamp: "1w ago",
    },
  ];

  const getIcon = (type: Activity["icon"]) => {
    const styles = {
      file: {
        bg: "bg-[#FDDD60]/20",
        text: "text-[#FDDD60]",
        icon: FileText,
      },
      issue: {
        bg: "bg-[#FF6E76]/20",
        text: "text-[#FF6E76]",
        icon: CheckCircle,
      },
      submittal: {
        bg: "bg-[#59D9F9]/20",
        text: "text-[#59D9F9]",
        icon: Upload,
      },
    };

    const { bg, text, icon: Icon } = styles[type];
    return (
      <div className={`p-2 rounded-full ${bg} shadow-sm`}>
        <Icon className={`h-5 w-5 ${text}`} />
      </div>
    );
  };

  return (
    <Card className={`rounded-xl border shadow-md`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className={`h-6 w-6 ${isDark ? "text-[#59D9F9]" : "text-[#FF6E76]"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Activity Feed</h3>
        </div>
        <SectionDivider className="mb-6" />

        {/* List */}
        <ul className="relative">
          {activities.map((activity, index) => (
            <li
              key={activity.id}
              className={`flex items-start gap-4 py-4 relative animate-fadeIn ${isDark ? "text-gray-200" : "text-gray-700"}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Timeline Line */}
              {index < activities.length - 1 && (
                <div className="absolute left-5 top-12 h-[calc(100%-2rem)] w-0.5 border-l-2 border-dashed border-gray-300 dark:border-zinc-700"></div>
              )}

              {/* Icon */}
              {getIcon(activity.icon)}

              {/* Content */}
              <div className="flex-1 group transition-all duration-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg p-3">
                <p
                  className="text-sm font-medium"
                  dangerouslySetInnerHTML={{ __html: activity.description }}
                />
                <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {activity.timestamp}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default ActivityFeed;