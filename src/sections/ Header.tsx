import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage(); // Nhận giá trị từ context
  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-80 backdrop-blur-md shadow-md z-50 text-center">
      <div className="flex justify-between items-center px-10 py-1">
        {/* Logo */}
        <div className="flex text-center items-center">
          <img src="/logo/logo.png" className="h-12 w-12" alt="Logo" />
          <h1 className="text-xl font-bold text-green-600">DeepBIM</h1>
        </div>

        {/* Navigation + Language Switcher */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <a className="hover:text-green-600 transition">{t("navbar.connect")}</a>
            <a className="hover:text-green-600 transition">{t("navbar.features")}</a>
            <a className="hover:text-green-600 transition">{t("navbar.how_it_works")}</a>
            <a className="hover:text-green-600 transition">{t("navbar.contact")}</a>
          </nav>

          {/* Bắt đầu Button */}
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            {t("navbar.start")}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            {language.toUpperCase()}
          </button>
          <ProfileDropdown/>
        </div>
      </div>
    </header>
  );
};

export default Header;
