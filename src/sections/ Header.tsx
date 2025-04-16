import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/theme-context";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogoWord } from "@/components/LogoWord";
import { CiLight } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaPlug, FaStar, FaQuestionCircle, FaEnvelope } from "react-icons/fa";

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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

  const navLinkStyle = `text-sm font-medium cursor-pointer transition-colors`;
  const hoverColor = theme === "dark" ? "hover:text-green-400" : "hover:text-secondary-700";

  const links = [
    { href: "/connectors", label: t("navbar.connect"), icon: <FaPlug />, ariaLabel: t("navbar.connect") },
    { href: "/features", label: t("navbar.features"), icon: <FaStar />, ariaLabel: t("navbar.features") },
    { href: "/how-it-works", label: t("navbar.how_it_works"), icon: <FaQuestionCircle />, ariaLabel: t("navbar.how_it_works") },
    { href: "/contact-us", label: t("navbar.contact"), icon: <FaEnvelope />, ariaLabel: t("navbar.contact") },
  ];

  return (
    <>
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-md text-center ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white bg-opacity-80 text-black"
        }`}
      >
        <div className="flex justify-between items-center px-4 md:px-10 py-2">
          {/* Logo */}
          <div className="flex items-center">
            <LogoWord />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {links.map((link) => (
              <a key={link.href} href={link.href} className={`${navLinkStyle} ${hoverColor}`}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions (Always in Header) */}
          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="bg-zinc-500 h-4 hidden md:block" />
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="text-sm px-1 transition icon-text-color"
            >
              {language.toUpperCase()}
            </Button>
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="text-sm px-1 transition icon-text-color"
            >
              {theme === "light" ? <CiLight /> : <MdOutlineDarkMode />}
            </Button>

            {/* Profile dropdown */}
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
          <a
            key={link.href}
            href={link.href}
            className={`${navLinkStyle} ${hoverColor} text-xl p-2`}
            aria-label={link.ariaLabel}
          >
            {link.icon}
          </a>
        ))}
      </nav>
    </>
  );
};

export default Header;