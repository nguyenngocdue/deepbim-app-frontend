import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/theme-context";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { CiDark, CiLight } from "react-icons/ci";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { Separator } from "@/components/ui/separator";

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  // Hàm chuyển đổi theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-50 text-center ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white bg-opacity-80 text-black"
      }`}
    >
      <div className="flex justify-between items-center px-10 py-1">
        {/* Logo */}
        <div className="flex text-center items-center">
          <img src="/images/logo.png" className="h-12 w-12" alt="Logo" />
          <h1
            className={`text-xl font-bold ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}
          >
            DeepBIM
          </h1>
        </div>

        {/* Navigation + Language/Theme Switcher */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4">
            <a
              className={`text-sm font-medium hover:${
                theme === "dark" ? "text-green-400" : "text-secondary-700"
              } cursor-pointer transition-colors hidden md:block`}
            >
              {t("navbar.connect")}
            </a>
            <a
              className={`text-sm font-medium hover:${
                theme === "dark" ? "text-green-400" : "text-secondary-700"
              } cursor-pointer transition-colors hidden md:block`}
            >
              {t("navbar.features")}
            </a>
            <a
              className={`text-sm font-medium hover:${
                theme === "dark" ? "text-green-400" : "text-secondary-700"
              } cursor-pointer transition-colors hidden md:block`}
            >
              {t("navbar.how_it_works")}
            </a>
            <a
              className={`text-sm font-medium hover:${
                theme === "dark" ? "text-green-400" : "text-secondary-700"
              } cursor-pointer transition-colors hidden md:block`}
            >
              {t("navbar.contact")}
            </a>
          </nav>
          <Separator orientation="vertical" className="bg-zinc-500 h-4" />
          {/* Language Switcher */}
          <Button
            variant='ghost'
            onClick={toggleLanguage}
            className="text-sm px-1 transition icon-text-color"
          >
            {language.toUpperCase()}
          </Button>

          {/* Theme Switcher - Chỉ icon */}
          <Button
            variant='ghost'
            onClick={toggleTheme}
            className="text-sm px-1  transition icon-text-color"
          >
            {theme === "light" ? <CiLight /> : <MdOutlineDarkMode />}
          </Button>

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;