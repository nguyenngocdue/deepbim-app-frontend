import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage(); // Nhận giá trị từ context
  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-80 backdrop-blur-md shadow-md z-50 text-center">
      <div className="flex justify-between items-center px-10 py-1">
        {/* Logo */}
        <div className="flex text-center items-center">
          <img src="/images/logo.png" className="h-12 w-12" alt="Logo" />
          <h1 className="text-xl font-bold text-green-600">DeepBIM</h1>
        </div>

        {/* Navigation + Language Switcher */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <a className="text-sm font-medium hover:text-secondary-700 cursor-pointer transition-colors hidden md:block">{t("navbar.connect")}</a>
            <a className="text-sm font-medium hover:text-secondary-700 cursor-pointer transition-colors hidden md:block">{t("navbar.features")}</a>
            <a className="text-sm font-medium hover:text-secondary-700 cursor-pointer transition-colors hidden md:block">{t("navbar.how_it_works")}</a>
            <a className="text-sm font-medium hover:text-secondary-700 cursor-pointer transition-colors hidden md:block">{t("navbar.contact")}</a>
          </nav>

          {/* Bắt đầu Button */}
          <Button className="px-4 text-neutral-800 bg-green-600 text-white rounded hover:bg-green-700 transition">
            {t("navbar.start")}
          </Button>

          {/* Language Switcher */}
          <Button
            onClick={toggleLanguage}
            className="text-sm px-2 border border-gray-300 rounded  transition"
          >
            {language.toUpperCase()}
          </Button>
          <ProfileDropdown/>
        </div>
      </div>
    </header>
  );
};

export default Header;
