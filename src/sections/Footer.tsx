import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className=" py-4 text-gray-600">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <p className="text-sm">© 2025 {t("footer.copyright")}</p>
        <nav className="flex gap-6 text-sm mt-2 md:mt-0">
          <a href="/terms" className="hover:text-gray-900">{t("footer.terms")}</a>
          <a href="/privacy" className="hover:text-gray-900">{t("footer.privacy")}</a>
          <a href="/contact" className="hover:text-gray-900">{t("footer.contact")}</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
