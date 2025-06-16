import { CircularProgress } from "@/components/CircularProgress";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { LogoWord } from "@/components/LogoWord";
import { ThemeSwitch } from "@/components/theme-switch";
import { ChevronLeft, HelpCircle, FileText, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CourseHeaderProps {
  courseTitle: string;
  progressPercent: number;
  current: number;
  total: number;
  onBack?: () => void;
}

export default function CourseHeader({
  courseTitle,
  progressPercent,
  current,
  total,
  onBack,
}: CourseHeaderProps) {
  const progress = Math.min(100, Math.max(0, progressPercent));

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 h-14 sm:h-14 bg-background border-background/50 sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-muted focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary active:scale-95 transition-all duration-150 min-w-[32px] min-h-[32px]"
            aria-label="Go back"
            type="button"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <LogoWord size="sm" />
          <h1 className="text-sm sm:text-base font-medium tracking-tight truncate max-w-[160px] sm:max-w-[240px] md:max-w-[320px] text-foreground">
            {courseTitle}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        <CircularProgress
          current={current}
          total={total}
          size={typeof window !== "undefined" && window.innerWidth < 640 ? 32 : 40}
          className="transition-all duration-500 ease-in-out"
        />

        {/* Dropdown for mobile */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-3 rounded-full hover:bg-muted transition duration-200 focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="More actions"
              >
                <MoreVertical size={20} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText size={16} className="mr-2" />
                Notes
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle size={16} className="mr-2" />
                Guide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Full buttons for desktop */}
        <div className="hidden sm:flex gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted transition"
            aria-label="Notes"
          >
            <FileText size={16} />
            <span>Notes</span>
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted transition"
            aria-label="Guide"
          >
            <HelpCircle size={16} />
            <span>Guide</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
