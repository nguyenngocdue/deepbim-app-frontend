import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { LogoWord } from "@/components/LogoWord";
import { FaPlug, FaStar, FaQuestionCircle, FaEnvelope } from "react-icons/fa";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { Link, useRouterState } from "@tanstack/react-router";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import LanguageButton from "@/components/common/LanguageButton";
import { LuBadgePlus } from "react-icons/lu";
import { VscRemoteExplorer } from "react-icons/vsc";
import CustomBadge from "@/components/common/CustomBadge";

// Define interfaces for type safety
interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
  isDev?: boolean;
}

interface LanguageContext {
  language: string;
  toggleLanguage: () => void;
}

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage() as LanguageContext;
  const [showBottomNav, setShowBottomNav] = useState<boolean>(true);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (href: string): boolean => pathname === href;

  const resetHideTimer = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    const timeout = setTimeout(() => setShowBottomNav(false), 15000);
    setHideTimeout(timeout);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowBottomNav(true);
        resetHideTimer();
      }
    };
    window.addEventListener("scroll", handleScroll);
    resetHideTimer();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);

  const navLinkStyle = `sm:mt-4 text-sm sm:text-base md:text-lg`;

  const links: NavLink[] = [
    { href: "/app", label: t("navbar.home"), icon: <FaPlug className="h-5 w-5" />, ariaLabel: t("navbar.home") },
    { href: "/app/connectors", label: t("navbar.connect"), icon: <LuBadgePlus className="h-5 w-5" />, ariaLabel: t("navbar.connect") },
    { href: "/app/features", label: t("navbar.features"), icon: <FaStar className="h-5 w-5" />, ariaLabel: t("navbar.features") },
    { href: "/app/how-it-works", label: t("navbar.how_it_works"), icon: <FaQuestionCircle className="h-5 w-5" />, ariaLabel: t("navbar.how_it_works") },
    { href: "/app/contact-us", label: t("navbar.contact"), icon: <FaEnvelope className="h-5 w-5" />, ariaLabel: t("navbar.contact") },
    { href: "/tutorials/home-page", label: t("navbar.tutorial"), icon: <VscRemoteExplorer className="h-5 w-5" />, ariaLabel: t("navbar.tutorial"), isDev: true },
    { href: "/coming-soon", label: t("navbar.blog"), icon: <VscRemoteExplorer className="h-5 w-5" />, ariaLabel: t("navbar.blog"), isDev: true },
  ];

  return (
    <>
      <header className={`${CLASS_NAME_DEFAULT.CLASS_NAME_3} fixed top-0 left-0 w-full z-50 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-md bg-white/80 dark:bg-slate-900/80`}>
        <div className="mx-auto max-w-7xl flex flex-wrap justify-between items-center py-3 gap-y-2">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <LogoWord />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center text-slate-800 dark:text-slate-100 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t("navbar.toggle_menu")}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 flex-wrap">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`whitespace-nowrap ${navLinkStyle} ${
                  isActive(link.href)
                    ? "text-reverse"
                    : "dark:text-slate-100 text-slate-800 hover:text-[#40DBCB] dark:hover:text-[#40DBCB]"
                }`}
                aria-label={link.ariaLabel}
              >
                {link.label}
                {link.isDev && <CustomBadge text="dev" className="bg-red-950 dark:bg-red-950 p-1 ml-1" />}
              </Link>
            ))}
          </nav>

          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageButton language={language} onClick={toggleLanguage} />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden w-full flex flex-col items-center gap-4 py-4 transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`whitespace-nowrap text-base ${
                  isActive(link.href)
                    ? "text-reverse"
                    : "dark:text-slate-100 text-slate-800 hover:text-[#40DBCB] dark:hover:text-[#40DBCB]"
                }`}
                aria-label={link.ariaLabel}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
                {link.isDev && <CustomBadge text="dev" className="bg-red-400 dark:bg-red-400" />}
              </Link>
            ))}
            <div className="flex flex-col items-center gap-4 mt-4">
              <LanguageButton language={language} onClick={toggleLanguage} />
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Navigation (Mobile Only) */}
      <nav
        className={`fixed bottom-0 left-0 w-full md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md z-20 flex justify-around items-center py-2 transition-transform duration-300 ease-in-out ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`p-3 text-xl rounded-full transition-colors ${
              isActive(link.href)
                ? "text-reverse bg-gray-100 dark:bg-slate-800"
                : "text-slate-800 dark:text-slate-100 hover:text-[#40DBCB] dark:hover:text-[#40DBCB]"
            }`}
            aria-label={link.ariaLabel}
          >
            {link.icon}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Header;