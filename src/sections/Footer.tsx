import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="hero py-4 sm:py-6 text-gray-600">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm">© 2025 {t("footer.copyright")}</p>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-800 transition-colors duration-200"
            activeProps={{ className: "text-primary-800 font-bold" }}
          >
            {t("footer.terms")}
          </Link>
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-800 transition-colors duration-200"
            activeProps={{ className: "text-primary-800 font-bold" }}
          >
            {t("footer.privacy")}
          </Link>
          <Link
            to="/contact-us"
            className="text-primary-600 hover:text-primary-800 transition-colors duration-200"
            activeProps={{ className: "text-primary-800 font-bold" }}
          >
            {t("footer.contact")}
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;