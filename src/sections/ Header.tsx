import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/theme-context";
import { LogoWord } from "@/components/LogoWord";
import { FaPlug, FaStar, FaQuestionCircle, FaEnvelope } from "react-icons/fa";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import LeftHeader from "./LeftHeader";
import { Link, useRouterState } from "@tanstack/react-router";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import LanguageButton from "@/components/common/LanguageButton";

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (href: string) => pathname === href;


  // Detect scroll to show bottom navigation, and hide after scrolling stops
  useEffect(() => {
    const handleScroll = () => {
      // Show bottom nav if scrolled down more than 50px
      if (window.scrollY > 50) {
        setShowBottomNav(true);
      } else {
        setShowBottomNav(false);
      }

      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set a new timeout to hide the bottom nav after 1 second of no scrolling
      const timeout = setTimeout(() => {
        setShowBottomNav(false);
      }, 1000); // Hide after 1 second of no scrolling
      setScrollTimeout(timeout);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  const navLinkStyle = `sm:mt-4 text-sm sm:text-base md:text-lg  `;
  const hoverColor = theme === "dark" ? "hover:text-green-400" : "hover:text-secondary-700";

  const links = [
    { href: "/app", label: t("navbar.home"), icon: <FaPlug />, ariaLabel: t("navbar.home") },
    { href: "/app/connectors", label: t("navbar.connect"), icon: <FaPlug />, ariaLabel: t("navbar.connect") },
    { href: "/app/features", label: t("navbar.features"), icon: <FaStar />, ariaLabel: t("navbar.features") },
    { href: "/app/how-it-works", label: t("navbar.how_it_works"), icon: <FaQuestionCircle />, ariaLabel: t("navbar.how_it_works") },
    { href: "/app/contact-us", label: t("navbar.contact"), icon: <FaEnvelope />, ariaLabel: t("navbar.contact") },
  ];

  return (
    <>
      {/* Fixed Header */}
      <header
        className={` ${CLASS_NAME_DEFAULT.CLASS_NAME_3} fixed top-0 left-0 w-full z-50 backdrop-blur-md px-6 shadow-md text-center ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white bg-opacity-80 text-black"
        }`}
      >
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center">
            <LogoWord />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4  ">
            {links.map((link) => (
              <Link key={link.href} to={link.href} 
                    className={`${navLinkStyle} ${hoverColor} ${
                      isActive(link.href) ?  `text-reverse ` : 'text-50'
                    }`}
                    >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Actions (Always in Header) */}
            <div className=' flex items-center space-x-4'>
              <LanguageButton language={language} onClick={toggleLanguage} className=""/>
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
        </div>
      </header>

      {/* Fixed Bottom Navigation (Mobile Only, Shown on Scroll, Hidden When Scroll Stops) */}
      <nav
        className={`fixed bottom-0 left-0 w-full z-50 md:hidden flex justify-around items-center py-2 shadow-md transition-all duration-300 ease-in-out ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white bg-opacity-80 text-black"
        } ${showBottomNav ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`${navLinkStyle} ${hoverColor} text-xl p-2`}
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