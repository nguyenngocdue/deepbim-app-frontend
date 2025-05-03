// src/components/LeftHeader.tsx

import { ProfileDropdown } from '@/components/ProfileDropdown';
import { Button } from '@/components/ui/button';
import React from 'react';
import { CiLight } from 'react-icons/ci';
import { MdOutlineDarkMode } from 'react-icons/md';

interface LeftHeaderProps {
  toggleLanguage: () => void;
  language: string;
  toggleTheme: () => void;
  theme: string;
  setLanguage?: boolean,
  className?:string
}

const LeftHeader: React.FC<LeftHeaderProps> = ({ toggleLanguage, language, toggleTheme, theme, setLanguage = true, className }) => {
  return (
    <div className="flex items-center gap-1">
      {
        setLanguage && (
          <Button variant="ghost" onClick={toggleLanguage} className={`text-sm transition icon-text-color  ${className}`}>
            {language.toUpperCase()}
          </Button>
        )
      }
      <Button variant="ghost" onClick={toggleTheme} className={`text-sm transition icon-text-color`}>
        {theme === 'light' ? <CiLight /> : <MdOutlineDarkMode />}
      </Button>
      <ProfileDropdown />
    </div>
  );
};

export default LeftHeader;
