// src/components/Menubar.tsx
import React, { useEffect, useState, useRef } from "react";
import { Shapes, HelpCircle, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import DocumentationModal from "@/components/ifc-classifier/docs/DocumentationModal";
import LanguageButton from "@/components/common/LanguageButton";
import { ThemeSwitch } from "@/components/theme-switch";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { LogoWord } from "@/components/LogoWord";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";

const Menubar = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    };
    if (isLangDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangDropdownOpen]);

  if (!mounted) return null;

  return (
    <nav className="bg-transparent border-color-standard border-b fixed top-0 left-0 right-0 z-50 pointer-events-none backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[hsl(var(--background)/80)] to-transparent pointer-events-auto">
        <div className="flex items-center justify-between mx-auto px-4 h-16 max-w-screen">
          {/* Left: Logo */}
          <LogoWord/>
          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <LanguageButton language={language} onClick={toggleLanguage} />
            <ThemeSwitch />
            <ProfileDropdown />
            {/* <button
              onClick={() => setIsDocsModalOpen(true)}
              className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={t("openDocs")}
            >
              <HelpCircle className="h-6 w-6 text-foreground" />
            </button> */}
          </div>
        </div>
      </div>
      {/* {isDocsModalOpen && (
        <DocumentationModal onClose={() => setIsDocsModalOpen(false)} />
      )} */}
    </nav>
  );
};

export default Menubar;
