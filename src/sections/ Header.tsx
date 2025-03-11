import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="flex justify-between items-center px-10 py-5 bg-white shadow-md">
      <h1 className="text-xl font-bold text-green-600">Viralution</h1>
      <nav className="flex gap-6">
        <a>{t("navbar.connect")}</a>
        <a>{t("navbar.features")}</a>
        <a>{t("navbar.how_it_works")}</a>
        <a>{t("navbar.contact")}</a>
        <button className="px-4 py-2 bg-green-600 text-white rounded">{t("navbar.start")}</button>
        <LanguageSwitcher />
      </nav>
    </header>
  );
};

export default Header;
