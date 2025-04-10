import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage("vi")}
        className={`px-4 py-2 border rounded-md ${i18n.language === "vi" ? "bg-gray-300" : ""}`}
      >
        🇻🇳 VI
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-4 py-2 border rounded-md ${i18n.language === "en" ? "bg-gray-300" : ""}`}
      >
        🇺🇸 EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
