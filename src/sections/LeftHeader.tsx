// src/components/LeftHeader.tsx

import React from 'react';
import { CiLight } from 'react-icons/ci';
import { MdOutlineDarkMode } from 'react-icons/md';
import { ProfileDropdown } from '@/components/ProfileDropdown';

interface LeftHeaderProps {
  toggleLanguage: () => void;
  language: string;
  toggleTheme: () => void;
  theme: string;
  setLanguage?: boolean;
  className?: string;
}

const LeftHeader: React.FC<LeftHeaderProps> = ({
  toggleLanguage,
  language,
  toggleTheme,
  theme,
  setLanguage = true,
  className,
}) => {
  return (
    <div className="flex items-center gap-1">
      {setLanguage && (
        <button
          onClick={toggleLanguage}
          className={`text-sm px-2 py-1 rounded hover:bg-zinc-800 dark:hover:bg-zinc-800 transition text-muted ${className}`}
        >
          {language.toUpperCase()}
        </button>
      )}
      <button
        onClick={toggleTheme}
        className="text-lg p-2 rounded hover:bg-zinc-800 dark:hover:bg-zinc-800 transition icon-text-color"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <CiLight className='text-muted hover:bg-zinc-800'/> : <MdOutlineDarkMode className='text-muted hover:bg-zinc-800'/>}
      </button>
      <ProfileDropdown />
    </div>
  );
};

export default LeftHeader;
