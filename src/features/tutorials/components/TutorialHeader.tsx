import { useState } from "react";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import { Search } from "lucide-react";
import { LogoWord } from "@/components/LogoWord";

export function TutorialHeader() {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <header
      className="w-full bg-gray-50 dark:bg-gray-900  fixed top-0 left-0 z-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 transition-all duration-300"
    >
      <div className="mx-auto  max-w-[1550px] flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <LogoWord />
        </div>

        {/* Search Inline (small size) */}
        {!isFocused && (
          <div className="flex-1 mx-2 xs:mx-3 sm:mx-4">
            <div className="relative w-full max-w-full xs:max-w-xs sm:max-w-sm md:max-w-md">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                onFocus={() => setIsFocused(true)}
                className="w-full pl-9 xs:pl-10 pr-4 py-1.5 xs:py-2 text-xs xs:text-sm sm:text-base rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 transition-all duration-300"
                aria-label="Tìm kiếm khóa học, bài viết, video"
              />
              <Search
                className="absolute left-2.5 xs:left-3 top-2 xs:top-2.5 h-4 xs:h-5 w-4 xs:w-5 text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>

        {/* Full-size Search Row (when focused) */}
        {isFocused && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-center transition-all duration-300">
            <div className="relative w-full max-w-full xs:max-w-lg sm:max-w-xl md:max-w-2xl">
              <input
                autoFocus
                type="text"
                placeholder="Tìm kiếm khóa học, bài viết, video..."
                onBlur={() => setIsFocused(false)}
                className="w-full pl-10 xs:pl-11 pr-4 py-2 xs:py-3 text-sm xs:text-base sm:text-lg rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg dark:shadow-gray-800/40 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 transition-all duration-300"
                aria-label="Tìm kiếm khóa học, bài viết, video"
              />
              <Search
                className="absolute left-3 xs:left-3.5 top-2.5 xs:top-3 h-5 xs:h-6 w-5 xs:w-6 text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
