import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { toYYYYMMDD } from "@/utils/date-time";
import {
  CalendarDays,
  User,
  Briefcase,
  Users,
  FolderClosed,
} from "lucide-react";

export function SubProjectInfo({data}) {
  if(!data) return;
  const info = {
    name: data.name,
    description: data.description,
    projectName: data.project.name,
    createdBy: data.creator.user_name,
    startTime: toYYYYMMDD(data.start_time),
    endTime: toYYYYMMDD(data.end_time),
    owner: data.owner.user_name,
    discipline: data.discipline.name,
    partner: data.partner,
    updatedAt: data.updated_at,
  };

  const Item = ({ label, icon, value, borderColor, index }) => (
    <div
      className={`grid grid-cols-[40px_150px_1fr] items-center gap-3 p-4 border-4 ${borderColor} bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#4B5563] rounded-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] dark:hover:shadow-[6px_6px_0px_#4B5563] animate-popIn`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="text-gray-800 dark:text-gray-200">{icon}</div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <div className="text-sm font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#EBECF0] dark:bg-zinc-900 min-h-[400px] flex items-center border border-gray-200 dark:border-zinc-800 rounded-2xl">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="mb-8 pl-4 border-l-4 border-[#FF6E76]">
          <div className="flex items-center gap-3 mb-2">
            <FolderClosed className="h-8 w-8 text-[#FDDD60]" />
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {info.name}
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            {info.description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            <DateTimeDisplay isoDate={info.updatedAt}/>
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Project Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Info</h3>
            <Item
              label="Belongs to Project:"
              icon={<FolderClosed className="h-5 w-5" />}
              value={info.projectName}
              borderColor="border-[#FF8A45]"
              index={0}
            />
            <Item
              label="Discipline:"
              icon={<Briefcase className="h-5 w-5" />}
              value={info.discipline}
              borderColor="border-[#FDDD60]"
              index={1}
            />
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Timeline</h3>
            <Item
              label="Start Date:"
              icon={<CalendarDays className="h-5 w-5" />}
              value={info.startTime}
              borderColor="border-[#59D9F9]"
              index={2}
            />
            <Item
              label="End Date:"
              icon={<CalendarDays className="h-5 w-5" />}
              value={info.endTime}
              borderColor="border-[#59D9F9]"
              index={3}
            />
          </div>

          {/* Team */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team</h3>
            <Item
              label="Created by:"
              icon={<User className="h-5 w-5" />}
              value={info.createdBy}
              borderColor="border-[#7CFFB2]"
              index={4}
            />
            <Item
              label="Owner:"
              icon={<User className="h-5 w-5" />}
              value={info.owner}
              borderColor="border-[#FF6E76]"
              index={5}
            />
            <Item
              label="Partner:"
              icon={<Users className="h-5 w-5" />}
              value={info.partner}
              borderColor="border-[#7CFFB2]"
              index={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubProjectInfo;