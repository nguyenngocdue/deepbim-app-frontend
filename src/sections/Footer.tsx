import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-6 text-muted-foreground bg-background/80 backdrop-blur-md border-t border-border mt-20 border-gray-200 dark:border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center md:text-left">© 2025 {t("footer.copyright")}</p>

        <nav className="flex flex-wrap justify-center gap-4 text-sm">
          <Link
            to="/"
            className="text-zinc-500 hover:text-lime-500 transition-colors duration-200"
            activeProps={{ className: "text-lime-500 font-medium" }}
          >
            {t("footer.terms")}
          </Link>
          <Link
            to="/"
            className="text-zinc-500 hover:text-lime-500 transition-colors duration-200"
            activeProps={{ className: "text-lime-500 font-medium" }}
          >
            {t("footer.privacy")}
          </Link>
          <Link
            to="/contact-us"
            className="text-zinc-500 hover:text-lime-500 transition-colors duration-200"
            activeProps={{ className: "text-lime-500 font-medium" }}
          >
            {t("footer.contact")}
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
