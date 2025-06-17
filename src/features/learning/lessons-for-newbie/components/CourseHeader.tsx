import { useEffect, useState } from "react";
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
import { CLASS_NAME_DEFAULT } from "@/utils/class";

// Hook for media query to handle responsive sizing
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// Define interface for props
interface CourseHeaderProps {
  courseTitle: string;
  progressPercent: number;
  current: number;
  total: number;
  onBack?: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  courseTitle,
  progressPercent,
  current,
  total,
  onBack,
}) => {
  const progress = Math.min(100, Math.max(0, progressPercent));
  const isMobile = useMediaQuery("(max-width: 639px)");

  return (
    <header
      className={`${CLASS_NAME_DEFAULT.CLASS_NAME_3} fixed top-0 left-0 w-full z-50 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-md bg-white/80 dark:bg-slate-900/80`}
    >
      <div className="mx-auto  max-w-[1550px] flex items-center justify-between py-3 gap-2 sm:gap-4">
        {/* Left Section: Back Button, Logo, Title */}
        <div className="flex items-center gap-2 flex-shrink-0">
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
            <LogoWord />
            <h1
              className="text-xs xs:text-sm sm:text-base font-medium tracking-tight truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[200px] md:max-w-[300px] text-foreground"
            >
              {courseTitle}
            </h1>
          </div>
        </div>

        {/* Right Section: Progress, Actions, Dropdown */}
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
          <CircularProgress
            current={current}
            total={total}
            size={isMobile ? 32 : 40}
            className="transition-all duration-500 ease-in-out"
          />

          {/* Dropdown for Mobile */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-full hover:bg-muted transition duration-200 focus-visible:ring-2 focus-visible:ring-ring min-w-[32px] min-h-[32px]"
                  aria-label="More actions"
                >
                  <MoreVertical size={18} className="text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem className="text-sm">
                  <FileText size={16} className="mr-2" />
                  Notes
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm">
                  <HelpCircle size={16} className="mr-2" />
                  Guide
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Full Buttons for Tablet/Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-muted-foreground hover:bg-muted transition"
              aria-label="Notes"
            >
              <FileText size={16} />
              <span>Notes</span>
            </button>
            <button
              className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-muted-foreground hover:bg-muted transition"
              aria-label="Guide"
            >
              <HelpCircle size={16} />
              <span>Guide</span>
            </button>
          </div>

          {/* Theme and Profile Actions */}
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default CourseHeader;