import { useState } from "react";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import { Search } from "lucide-react";
import { LogoWord } from "@/components/LogoWord";

export function TutorialHeader() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <header className="w-full bg-gray-50 dark:bg-gray-900 shadow-lg dark:shadow-gray-800/50 fixed top-0 left-0 z-50 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-2 transition-all duration-300">
      <div className="flex flex-col items-center gap-2 sm:gap-3 transition-all duration-300">
        
        {/* Top Row: Logo + Search Inline + Actions */}
        <div className="flex w-full items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
           <LogoWord/>
          </div>

          {/* Search Inline (small size) */}
          {!isFocused && (
            <div className="flex-1 mx-2 sm:mx-4">
              <div className="relative w-full max-w-full sm:max-w-sm mx-auto">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  onFocus={() => setIsFocused(true)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none transition-all duration-300"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>

        {/* Full-size Search Row (when focused) */}
        {isFocused && (
          <div className="w-full px-2 sm:px-0 max-w-3xl transition-all duration-300">
            <div className="relative w-full">
              <input
                autoFocus
                type="text"
                placeholder="Tìm kiếm khóa học, bài viết, video..."
                onBlur={() => setIsFocused(false)}
                className="w-full pl-10 pr-4 py-3 text-base rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg dark:shadow-gray-800/40 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 transition-all duration-300"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
