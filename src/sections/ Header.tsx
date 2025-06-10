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

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [showBottomNav, setShowBottomNav] = useState(true); // Mặc định là true
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (href: string) => pathname === href;

  // Hàm để reset timer ẩn nav
  const resetHideTimer = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    const timeout = setTimeout(() => {
      setShowBottomNav(false);
    }, 10000); // Ẩn sau 5 giây
    setHideTimeout(timeout);
  };

  // Detect scroll để hiện nav và reset timer
  useEffect(() => {
    const handleScroll = () => {
      // Chỉ hiện khi scroll xuống > 50px
      if (window.scrollY > 50) {
        setShowBottomNav(true);
        resetHideTimer();
      }
    };

    window.addEventListener("scroll", handleScroll);
    resetHideTimer(); // Bắt đầu đếm sau khi load xong

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);

  const navLinkStyle = `sm:mt-4 text-sm sm:text-base md:text-lg`;

  const links = [
    { href: "/app", label: t("navbar.home"), icon: <FaPlug />, ariaLabel: t("navbar.home") },
    { href: "/app/connectors", label: t("navbar.connect"), icon: <LuBadgePlus />, ariaLabel: t("navbar.connect") },
    { href: "/app/features", label: t("navbar.features"), icon: <FaStar />, ariaLabel: t("navbar.features") },
    { href: "/app/how-it-works", label: t("navbar.how_it_works"), icon: <FaQuestionCircle />, ariaLabel: t("navbar.how_it_works") },
    { href: "/app/contact-us", label: t("navbar.contact"), icon: <FaEnvelope />, ariaLabel: t("navbar.contact") },
  ];

  return (
    <>
      {/* Fixed Header */}
      <header
        className={`${CLASS_NAME_DEFAULT.CLASS_NAME_3} fixed top-0 left-0 w-full z-50 backdrop-blur-md px-6 shadow-md text-center`}
      >
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center">
            <LogoWord />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`${navLinkStyle} ${
                  isActive(link.href)
                    ? `text-reverse`
                    : 'dark:text-slate-100 text-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <LanguageButton language={language} onClick={toggleLanguage} className="" />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Fixed Bottom Navigation (Mobile Only) */}
      <nav
        className={`z-50 fixed bottom-0 left-0 w-full md:hidden flex justify-around items-center py-2 shadow-md transition-all duration-300 ease-in-out bg-background ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`${navLinkStyle} text-xl p-2`}
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