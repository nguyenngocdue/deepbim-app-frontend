import { useTheme } from "@/context/theme-context";

export default function ThemeSwitcherButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      {/* Nút bấm đổi theme */}
      <button
        onClick={toggleTheme}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transition-all"
      >
        {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </button>

      {/* Div test đổi màu */}
      <div className="w-64 h-32 flex items-center justify-center mt-6 rounded-lg
        bg-white text-black dark:bg-slate-800 dark:text-white shadow-md transition-all duration-300">
        {theme === "light" ? "Light Mode" : "Dark Mode"}
      </div>
    </div>
  );
}
