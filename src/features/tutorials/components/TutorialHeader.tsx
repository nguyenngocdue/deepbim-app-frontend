import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import { Search, Bell, User } from "lucide-react";

export function TutorialHeader() {
  return (
    <header className="w-full bg-gray-50 dark:bg-gray-900 shadow-lg dark:shadow-gray-800/50 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 fixed top-0 left-0 z-50">
      {/* Logo and Brand */}
      <div className="flex items-center space-x-4">
        <img
          src="/images/logo_no_bg.png"
          alt="Logo"
          className="h-8 w-auto md:h-10 transition-all duration-200 hover:scale-105"
        />
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100 md:text-xl lg:text-2xl transition-colors duration-200 hover:text-orange-500 dark:hover:text-orange-400">
          Học Lập Trình Đời Lắm
        </span>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-4 lg:mx-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học, bài viết, video..."
            className="w-full pl-10 pr-4 py-2 text-sm md:text-base rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-gray-800/30 transition-all duration-200 hover:shadow-md dark:hover:shadow-lg"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </div>

      {/* Mobile Search Toggle */}
      <div className="md:hidden">
        <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
          <Search className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}