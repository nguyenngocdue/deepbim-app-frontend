// src/components/LeftHeader.tsx

import { ProfileDropdown } from '@/components/ProfileDropdown';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { CiLight } from 'react-icons/ci';
import { MdOutlineDarkMode } from 'react-icons/md';

interface LeftHeaderProps {
  toggleLanguage: () => void;
  language: string;
  toggleTheme: () => void;
  theme: string;
}

const LeftHeader: React.FC<LeftHeaderProps> = ({ toggleLanguage, language, toggleTheme, theme }) => {
  return (
    <div className="flex items-center gap-2">

      <Button variant="ghost" onClick={toggleLanguage} className="text-sm px-1 transition icon-text-color">
        {language.toUpperCase()}
      </Button>
      <Button variant="ghost" onClick={toggleTheme} className="text-sm px-1 transition icon-text-color">
        {theme === 'light' ? <CiLight /> : <MdOutlineDarkMode />}
      </Button>
      <ProfileDropdown />
    </div>
  );
};

export default LeftHeader;
